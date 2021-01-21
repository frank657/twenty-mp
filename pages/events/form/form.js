const BC = require('../../../libs/bc');
const BU = require('../../../libs/bc-utils');
const app = getApp();
import { getInput } from 'form-helper';
import regeneratorRuntime from '../../../utils/runtime';

Component({
  attached() {
    this.setData({ today: BU.getToday() })
  },
  ready() {
    this.initEvent()
  },

  properties: {
    template: { type: Object, value: null, observer() { this.loadFields() } },
    event: { type: Object, value: null, observer() { this.loadFields() } },
    formType: { type: String, value: 'create' },
    t: Object
  },

  data: {
    eventPublished: true,
    showOther: false
  },

  methods: {
    // INIT DATA
    async initEvent() {
      let event = {signup_opens: true, is_published: true, no_limit: true};
      const { eventToUpdate, template } = this.data
      if (eventToUpdate) event = eventToUpdate
      if (template) event = template

      // take only fields that the form needs
      if (eventToUpdate||template) event = await this.initFields(event)
      this.setData({ event })
      console.log('event', event)
    },

    async initFields({id, title, description, image, form_date,
      venue_name, address, latitude, longitude, max_capacity,
      question, answers, is_published, signup_opens}) {

      const start_date = form_date.start.date
      const start_time = form_date.start.time
      const end_date = form_date.end.date
      const end_time = form_date.end.time
      const no_limit = !max_capacity

      const event = {id, title, description, image, start_date, start_time, end_date, end_time,
        venue_name, address, latitude, longitude, max_capacity, no_limit,
        question, answers, is_published, signup_opens}

      if (!event.question) {
        delete event.question
        delete event.answers
      }

      if (this.data.template) {
        event.imageToUpload = await this.getImagePath(event.image)
        delete event.image
        delete event.id
      }

      return event
    },

    getImagePath(img) {
      return new Promise((resolve, reject) => {
        const imgPath = this.data.template.image
        wx.getImageInfo({
          src: imgPath,
          success(res) {
            resolve(res.path)
          }
        })
      })
    },
    // INIT DATA END

    changeInput(e) { getInput(e, this) },

    showOtherOptions() {
      this.setData({showOther: !this.data.showOther})
    },

    // VALIDATION
    hasImage() {
      const { imageToUpload, image } = this.data.event
      return imageToUpload || image
    },

    hasQA() {
      const { question, answers } = this.data.event
      if (question) {
        return answers ? answers.filter(a=>a).length : answers
      } else {
        return !answers
      }

      return (question && answers && answers.length) || (!question && !answers)
    },

    hasCapacity() {
      let { max_capacity, no_limit } = this.data.event
      max_capacity = parseInt(max_capacity)
      return (max_capacity && !no_limit) || no_limit
    },

    validateEvent() {
      const validationErrors = {}
      const { event } = this.data
      if (!this.hasImage()) validationErrors.image = true
      if (!event.title) validationErrors.title = true
      if (!event.description) validationErrors.description = true
      if (!event.venue_name) validationErrors.venue = true
      if (!this.hasCapacity()) validationErrors.capacity = true
      if (!this.hasQA()) validationErrors.question = true
      return validationErrors
    },
    // VALIDATION END

    // REQUEST
    getEventBody() {
      const event = {...this.data.event}

      // TIME
      event.start_time = `${event.start_date} ${event.start_time}`
      event.end_time = `${event.end_date} ${event.end_time}`
      delete event.start_date
      delete event.end_date
      // CAPACITY
      if (event.no_limit) event.max_capacity = null
      delete event.no_limit
      // OTHER
      event.organization_id = app.globalData.userInfo.organization.id
      const answers = event.answers
      delete event.imageToUpload

      const data = { event }
      if (event.question) data.answers = event.answers
      delete event.answers

      return data
    },

    async submitEvent(e) {
      const pd = this.data
      const validationErrors = this.validateEvent()
      const isValid = !Object.keys(validationErrors).length

      if (isValid) {
        const { imageToUpload } = this.data.event
        const body = this.getEventBody()
        wx.showLoading({title: 'Loading'})
        if (pd.formType=='create') {
          BC.post(BC.getHost()+'events', body).then(res=>{
            console.log('form res', res)
            if (res.status=='success') {
              this.uploadFile(res.event.id, imageToUpload)
            }
          })
        } else if (pd.formType=='edit') {
          console.log('edit')
          const id = pd.event.id
          BC.put(BC.getHost()+'events/'+id, body).then(res=>{
            console.log('here', res)
            if (res.status=='success') {
              if (imageToUpload) {
                this.uploadFile(res.event.id, imageToUpload)
              } else {
                wx.navigateBack()
              }
            }
          })
        }
      } else {
        this.setData({ validationErrors })
        console.log('error', validationErrors)
        wx.p.showModal({
          showCancel: false,
          confirmText: 'OK',
          title: 'Details missing',
          content: 'Please fill out all details and try again.'
        })
      }
    },

    uploadFile(id, img) {
      const pd = this.data
      const formType = pd.formType
      const path = `${BC.getHost()}events/${id}/upload`

      const upload = (path, img) => {
        wx.uploadFile({
          url: path,
          filePath: img,
          name: 'image',
          header: app.globalData.headers,
          formData: {},
          success (res){
            const data = JSON.parse(res.data)
            if (data.status == 'success') {
              if (formType=='create') {
                console.log('event created')
                wx.redirectTo({
                  url: `/pages/events/show/show?id=${id}`,
                })
              } else if (formType=='edit') {
                wx.navigateBack()
              }
              console.log('uploaded', data)
              wx.hideLoading()
            } else {
              wx.showModal({
                showCancel: false,
                confirmText: 'OK',
                title: 'Upload failed',
                content: 'Please try again'
              })
              wx.hideLoading()
            }
          }
        })
      }

      upload(path, img)
    },
  }
})
