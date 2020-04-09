const BC = require('../../../libs/bc');

// pages/events/show/show.js
Page({
  data: {

  },

  join(e) {
    wx.showLoading({ title: 'Loading' })
    const { answer } = e.currentTarget.dataset
    console.log(answer)
    const data = answer
    // BC.post(`${BC.getHost()}xxxxx`, data).then(res=>{
      this.setData({answer})
      wx.showToast({ title: 'Thank you!' })
    // })
  },

  onLoad: function (options) {
    BC.getData(`events/${this.options.id}`).then(res=>{
      console.log(res)
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