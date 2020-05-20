const BC = require('../../../libs/bc');
// pages/events/edit/edit.js
Page({

  data: {

  },

  onLoad: function (options) {
    if (this.options.event) {
      wx.showLoading()
      BC.getData(`events/${this.options.event}`).then(res=>wx.hideLoading())
    }
    // this.setData({event: BC.lastPage().data.event})
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})