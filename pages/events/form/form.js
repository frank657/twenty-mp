const BC = require('../../../libs/bc');
const BU = require('../../../libs/bc-utils');
const app = getApp();
const { CoverImage } = require('../../../utils/cover-image')

Component({
  attached() {
    this.setData({ today: BU.getToday() })
  },
  
  properties: {
    template: { type: Object, value: null, observer() { this.loadFields() } },
    event: { type: Object, value: null, observer() { this.loadFields() } },
    formType: { type: String, value: 'create'}
  },

  data: {
    time: '20:00',
    defaultEndTime: '21:00',
    today: BU.getToday(),
    lastDate: BU.getDateFromToday(5),
    maxCapacity: false,
    signupOpen: false,
    eventPublished: true,
    signupInfo: "When the signup is closed, users cannot register themselves for your event. You can toggle between open or close at any time from your profile page or from the event page.",
    publishInfo: "If you have a public profile, only your published events will be shown in your profile. You can change the status at any time from your profile page or from the event page. However users who have previously viewed or signed up for this event, can still see the event from their home page."
  },

  methods: {
    loadFields() {
      this.setCapacity()
      if (this.data.event) { this.loadSignupAndPublished('event') }
      if (this.data.template) { this.loadSignupAndPublished('template') }
    },
    loadSignupAndPublished(type) {
      const signupOpen = this.data[type].signup_opens
      const eventPublished = this.data[type].is_published
      this.setData({ signupOpen, eventPublished })
    },

    setCapacity() {
      const {event, template} = this.data
      if (event) {
        if (event.max_capacity) this.setData({maxCapacity: true})
      }
      if (template) {
        if (template.max_capacity) this.setData({maxCapacity: true})
      }
    },
    selectMaxCapacity(e) {
      const { maxCapacity } = e.currentTarget.dataset
      const focusMaxCap = maxCapacity
      this.setData({ maxCapacity, focusMaxCap })
    },

    selectSignupOpen(e) { this.setData({ signupOpen: e.currentTarget.dataset.select }) },
    selectPublished(e) { this.setData({ eventPublished: e.currentTarget.dataset.select }) },

    bindDateChange: function(e) {
      const { type } = e.currentTarget.dataset
      if (type == 'start') { this.setData({ startDate: e.detail.value }) }
      if (type == 'end') { this.setData({ endDate: e.detail.value }) }
    },
  
    bindTimeChange: function(e) {
      const { type } = e.currentTarget.dataset
      if (type == 'start') { this.setData({ startTime: e.detail.value }) }
      if (type == 'end') { this.setData({ endTime: e.detail.value }) }
    },

    setDefaultEndTime(startTime) {
      // add 1 hour to start time as default end time
    },

    pinLocation() {
      console.log('clicked')
      const that = this
      wx.authorize({
        scope: 'scope.userLocation',
        success(res) {
          console.log(res)
          wx.chooseLocation({
            success(res) {
              that.setData({
                venue: res.name,
                address: res.address,
                long: res.longitude,
                lat: res.latitude
              })
            },
          })
        },
        fail(res) {
          console.log(res)
        }
      })
    },
  
    uploadImage() {
      const that = this
      wx.chooseImage({
        count: 1,
        success (res) {
          const tempFilePaths = res.tempFilePaths
          that.setData({imgTempFile: tempFilePaths[0]})
          // const {event, template} = that.data
          // if (event) event.image = null
          // if (template) template.image = null
          // that.setData({ event, template })
          that.setData({hasNewImage: true, hasNoImage: false})
        }
      })
    },
    removeImage() {
      // const {event, template} = this.data
      // const imgTempFile = null
      // if (event) event.image = null
      // if (template) template.image = null
      // this.setData({ event, template, imgTempFile })
      console.log('has image?', this.hasImage(), this.data)
      this.setData({hasNewImage: false, imgTempFile: null, hasNoImage: true})
    },
  
    hasImage() {
      const pd = this.data
      const hasImage = !pd.hasNoImage
      const hasNewImage = pd.hasNewImage && pd.imgTempFile
      const hasEventImage = (pd.event?pd.event.image:false)
      const hasTemplateImage = (pd.template?pd.template.image:false)
      return hasImage && (hasNewImage||hasEventImage||hasTemplateImage)
    },

    submitEvent(e) {
      const data = e.detail.value
      data.start_time = `${data.start_date} ${data.start_time}`
      data.end_time = `${data.end_date} ${data.end_time}`
      data.organization_id = app.globalData.userInfo.organization.id
      delete data.start_date
      delete data.end_date

      const pd = this.data

      const has_image = this.hasImage()
      const has_max_or_unlimited = (pd.maxCapacity && data.max_capacity) || !pd.maxCapacity
      const has_details = data.title&&data.description&&data.venue_name
      console.log(data)
      if (has_image&&has_max_or_unlimited&&has_details) {
        wx.showLoading({title: 'Loading'})        
        if (pd.formType=='create') {
          BC.post(BC.getHost()+'events', data).then(res=>{
            console.log('form res', res)
            if (res.status=='success') {
              this.uploadFile(res.event.id)
            }
          })
        } else if (pd.formType=='edit') {
          const id = pd.event.id
          BC.put(BC.getHost()+'events/'+id, data).then(res=>{
            console.log('here', res)
            if (res.status=='success') {
              if (pd.hasNewImage&&pd.imgTempFile) {
                this.uploadFile(res.event.id)
              } else {
                wx.navigateBack()
              }
            } 
          })
        }
      } else {
        wx.showModal({
          showCancel: false,
          confirmText: 'OK',
          title: 'Details missing',
          content: 'Please upload a picture and fill out all the details to continue'
        })
      }
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

    uploadFile(id) {
      const pd = this.data
      const formType = pd.formType
      const path = `${BC.getHost()}events/${id}/upload`
      var img;

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

      if (pd.imgTempFile&&pd.hasNewImage) { 
        img = pd.imgTempFile
        upload(path, img)
      } else if (!pd.hasNoImage&&pd.template.image) {
        this.getImagePath(img).then(res=>upload(path, res))
      }
    }
  }
})
