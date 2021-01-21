const app = getApp();
const BC = require('../../../libs/bc');
import { tl } from '../../../utils/tl.js';

Page({
  data: {
    showUpcoming: true
  },

  onShow() {
    this.setData({ showShareMenu: false, shareEvent: null })
    wx.showLoading()
    BC.getData(`organizations/${this.options.id}`).then(res=>{
      tl(this, false).then(tlRes=> this.setData({ t: tlRes.organizers.show}))
      wx.hideLoading()
    })
  },

  toggleNav(e) {
    const { showUpcoming } = e.detail
    this.setData({showUpcoming})
  },

  onPullDownRefresh: function () {

  },

  onShareAppMessage: function (options) {
    if (options.target&&options.target.dataset.event) {
      const e  = options.target.dataset.event
      const t = e.start_time
      let h = parseInt(t.time) 
      const i = t.time.indexOf(':')
      const m = t.time.slice(i+1, i+3)
      const mm = m=='00'?'':`:${m}`
      const date = `${parseInt(t.month_num)}/${parseInt(t.date)} ${h}${mm}${t.time.includes('PM')?'pm':'am'} `
      return {
        title: date + e.title,
        imageUrl: e.image,
        path: `/pages/events/show/show?id=${e.id}`
      }
    }
  }
})