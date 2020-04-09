const BC = require('../../../libs/bc');

// pages/events/show/show.js
Page({
  data: {
    answers: [
      {name: 'yes', label: 'Yes'},
      {name: 'no', label: 'No'},
      {name: 'maybe', label: 'Maybe'}
    ]
  },

  join(e) {
    BC.getUserInfo().then(res=>{
      console.log('userinfo', res)
      if (res.avatar) {
        wx.showLoading({ title: 'Loading' })
        const { answer } = e.currentTarget.dataset
        console.log(answer)
        const data = {attendee: {status: answer}}
        BC.post(`${BC.getHost()}events/${this.data.event.id}/attendee`, data).then(res=>{
          console.log('signed',res)
          if (res.status=='success') {
            this.setData({event: res.event, attending_status: res.attending_status})
            wx.showToast({ title: 'Thank you!' })
          } else {
            wx.showModal({
              showCancel: false,
              confirmText: 'OK',
              title: 'Failed to sign up',
              content: 'Please try again'
            })
          }
        })
      } else {
        wx.showModal({
          showCancel: false,
          confirmText: 'OK',
          title: 'Authorize user info',
          content: 'Please allow us to obtain user info to continue'
        })
      }
    })
  },

  onLoad: function (options) {
    wx.showLoading({ title: 'Loading', })
    BC.userInfoReady(this)
    BC.getData(`events/${this.options.id}`).then(res=>{
      wx.hideLoading()
    })
  },

  openMap() {
    const e = this.data.event
    wx.openLocation({
      latitude: e.latitude,
      longitude: e.longitude,
    })
  },

  onShareAppMessage: function () {
    const e = this.data.event
    return {
      title: e.title,
      imageUrl: e.image,
      path: `/pages/events/show/show?id=${e.id}`
    }
  }
})