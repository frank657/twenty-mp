const BC = require('../../../libs/bc');

Page({
  data: {
    selectedId: null,
    selectedAnswer: null,
    listView: false,
  },

  onLoad: function (options) {
    wx.hideShareMenu()
    this.setData({ attendees: BC.lastPage().data.event.attendees, event: BC.lastPage().data.event, userInfo: BC.lastPage().data.userInfo, creator: BC.lastPage().data.creator})
    // if (this.data.creator.user.id == this.data.userInfo.id) {this.setData({listView: true})}
  },

  tapUser(e) {
    // const { id } = e.currentTarget.dataset
    const { id } = e.detail
    console.log(id)
    if (id == this.data.selectedId) {
      this.setData({ selectedId: null })
    } else {
      this.setData({ selectedId: id })
    }
  },
  clearSelectedId() {
    this.setData({ selectedId: null })
  },
  selectAnswer(e) {
    const { index } = e.currentTarget.dataset
    console.log(index)
    if (index==this.data.selectedAnswer) {
      this.setData({ selectedAnswer: null })
    } else {
      this.setData({ selectedAnswer: index })
    }
  }
})