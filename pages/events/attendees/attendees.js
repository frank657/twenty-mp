const BC = require('../../../libs/bc');

Page({
  data: {
    selectedId: null,
    selectedAnswer: null,
  },

  onLoad: function (options) {
    wx.hideShareMenu()
    this.setData({attendees: BC.lastPage().data.event.attendees})    
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