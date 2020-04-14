const BC = require('../../../libs/bc');

Page({
  data: {
    selectedId: null
  },

  onLoad: function (options) {
    wx.hideShareMenu()
    this.setData({attendees: BC.lastPage().data.event.attendees})    
  },

  tapUser(e) {
    const { id } = e.currentTarget.dataset
    console.log(id)
    if (id == this.data.selectedId) {
      this.setData({ selectedId: null })
    } else {
      this.setData({ selectedId: id })
    }
  }
})