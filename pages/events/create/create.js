const BC = require('../../../libs/bc');
const BU = require('../../../libs/bc-utils');
const app = getApp();
// pages/events/create/create.js
Page({
  data: {
    time: '20:00',
    today: BU.getToday(),
    lastDate: BU.getDateFromToday(5)
  },

  signIn() {
    BC.getUserInfo()
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
    const that = this
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

  onLoad: function (options) {
    BC.userInfoReady(this)
    this.setData({ today: BU.getToday() })
  },

  uploadImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success (res) {
        const tempFilePaths = res.tempFilePaths
        that.setData({imgTempFile: tempFilePaths[0]})
      }
    })
  },
  removeImage() {
    this.setData({ imgTempFile: null })
  },

  createEvent(e) {
    const data = e.detail.value

    data.start_time = `${data.start_date} ${data.start_time}`
    data.end_time = `${data.end_date} ${data.end_time}`
    delete data.start_date
    delete data.end_date
    console.log(data)
    if (this.data.imgTempFile&&data.title&&data.description&&data.venue_name) {
      wx.showLoading({title: 'Loading'})
      BC.post(BC.getHost()+'events', data).then(res=>{
        console.log('res', res)
        if (res.status=='success') {
          const path = BC.getHost() + '/events/' + res.event.id + '/upload'
          const img = this.data.imgTempFile
          const id = res.event.id
          wx.uploadFile({
            url: path, 
            filePath: img,
            name: 'image',
            header: app.globalData.headers,
            formData: {},
            success (res){
              const data = JSON.parse(res.data)
              if (data.status == 'success') {
                wx.redirectTo({
                  url: `/pages/events/show/show?id=${id}`,
                })
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
      })
    } else {
      wx.showModal({
        showCancel: false,
        confirmText: 'OK',
        title: 'Details missing',
        content: 'Please upload a picture and fill out all the details to continue'
      })
    }
  }
})