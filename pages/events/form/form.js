const BC = require('../../../libs/bc');
const BU = require('../../../libs/bc-utils');
const app = getApp();

Component({
  attached() {
    this.setData({ today: BU.getToday() })
  },
  
  properties: {
    event: { type: Object, value: '', observer() {this.setCapacity()} },
    formType: { type: String, value: 'create'}
  },

  data: {
    time: '20:00',
    today: BU.getToday(),
    lastDate: BU.getDateFromToday(5),
    maxCapacity: false
  },

  methods: {
    setCapacity() {
      const event = this.data.event
      if (event) {
        if (event.max_capacity) {
          this.setData({maxCapacity: true})
        }
      }
    },
    selectMaxCapacity(e) {
      const { maxCapacity } = e.currentTarget.dataset
      const focusMaxCap = maxCapacity
      this.setData({ maxCapacity, focusMaxCap })
    },

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
          const event = that.data.event
          if (event) {
            delete event.image
            that.setData({ event })
          }
        }
      })
    },
    removeImage() {
      const event = this.data.event
      const imgTempFile = null
      if (event) {
        event.image = null
      }
      this.setData({ event, imgTempFile })
    },
  
    submitEvent(e) {
      const data = e.detail.value
      data.start_time = `${data.start_date} ${data.start_time}`
      data.end_time = `${data.end_date} ${data.end_time}`
      delete data.start_date
      delete data.end_date
      console.log(data)

      const pd = this.data
      const has_image = pd.imgTempFile||pd.event.image 
      const has_max_or_unlimited = (pd.maxCapacity && data.max_capacity) || !pd.maxCapacity
      const has_details = data.title&&data.description&&data.venue_name

      if (has_image&&has_max_or_unlimited&&has_details) {
        wx.showLoading({title: 'Loading'})        
        if (pd.formType=='create') {
          BC.post(BC.getHost()+'events', data).then(res=>{
            if (res.status=='success') {
              this.uploadFile(res.event.id)
            }
          })
        } else if (pd.formType=='edit') {
          const id = pd.event.id
          BC.put(BC.getHost()+'events/'+id, data).then(res=>{
            console.log('here', res)
            if (res.status=='success') {
              if (pd.imgTempFile) {
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

    uploadFile(id) {
      const formType = this.data.formType
      const path = `${BC.getHost()}events/${id}/upload`
      const img = this.data.imgTempFile
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
  }
})
