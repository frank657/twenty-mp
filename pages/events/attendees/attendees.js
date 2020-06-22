const BC = require('../../../libs/bc');

Page({
  data: {
    selectedId: null,
    listView: false,
  },

  onLoad: function (options) {
    wx.hideShareMenu()
    this.setData({ attendees: BC.lastPage().data.event.attendees, event: BC.lastPage().data.event, userInfo: BC.lastPage().data.userInfo, creator: BC.lastPage().data.creator})
    if (this.data.creator.user.id == this.data.userInfo.id) {this.setData({listView: true})}
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