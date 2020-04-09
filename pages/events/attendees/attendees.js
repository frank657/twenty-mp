const BC = require('../../../libs/bc');

Page({
  data: {

  },

  onLoad: function (options) {
    wx.hideShareMenu()
    this.setData({attendees: BC.lastPage().data.event.attendees})    
  },
})