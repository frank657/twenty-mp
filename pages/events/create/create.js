const BC = require('../../../libs/bc');
const BU = require('../../../libs/bc-utils');
// pages/events/create/create.js
Page({
  data: {
    time: '20:00',
    date: BU.getToday(),
  },

  bindDateChange: function(e) {
    this.setData({ date: e.detail.value })
  },

  bindTimeChange: function(e) {
    this.setData({ time: e.detail.value })
  },

  onLoad: function (options) {
    this.setData({
      today: BU.getToday(), 
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})