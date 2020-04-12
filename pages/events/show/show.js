const BC = require('../../../libs/bc');

// pages/events/show/show.js
Page({
  data: {
    answers: [
      {name: 'yes', label: 'Yes'},
      {name: 'no', label: 'No'},
      {name: 'maybe', label: 'Maybe'}
    ],
    showMore: false
  },

  clickMore() {
    this.setData({showMore: !this.data.showMore})
  },

  deleteEvent() {
    const that = this
    wx.showModal({
      cancelColor: '#000',
      cancelText: 'Back',
      confirmText: 'Confirm',
      title: 'Cancel Event',
      content: 'You are about to cancel this event. Do you want to confirm?',
      success(res) { 
        console.log(res)
        if (res.confirm) {
          const path = `${BC.getHost()}/events/${that.data.event.id}`
          BC.del(path).then(res=>{
            console.log(res)
            if (res.status=='success') {
              if (getCurrentPages().length>1) {
                wx.navigateBack()
              } else {
                wx.reLaunch({ url: '/pages/index/index' })
              }
            }
          })
        } else if (res.cancel) {
          that.setData({showMore: false})
        }
      }
    })
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

  onShow() {
    this.setData({ showMore: false })
    wx.showLoading({ title: 'Loading' })
    BC.userInfoReady(this)
    BC.getData(`events/${this.options.id}`).then(res=>{
      wx.hideLoading()
    })
  },

  openMap() {
    const e = this.data.event

    wx.openLocation({
      name: e.venue_name,
      address: e.address,
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