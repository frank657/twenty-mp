const BC = require('../../../libs/bc');
import { tl } from '../../../utils/tl.js';
// pages/events/edit/edit.js
Page({

  data: {

  },

  onLoad: function (options) {
    tl(this, false).then(res=> this.setData({ t: res.events.create }))
    if (this.options.event) {
      wx.showLoading()
      BC.getData(`events/${this.options.event}`).then(res=>wx.hideLoading())
    }
    // this.setData({event: BC.lastPage().data.event})
  },
})