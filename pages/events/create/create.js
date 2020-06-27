const BC = require('../../../libs/bc');
const BU = require('../../../libs/bc-utils');
const app = getApp();
// pages/events/create/create.js
Page({
  data: {
    event: null
  },
  onLoad() {
    BC.userInfoReady(this)
    this.loadTemplate()
  },

  signIn() {
    BC.getUserInfo()
  },

  loadTemplate() {
    if (this.options.template) {
      wx.showLoading()
      BC.getData(`events/${this.options.template}`, this, false).then(res=>{
        if (res.event.answers) res.event.answers = res.event.answers.map(a=>a.content)
        this.setData(res)
        wx.hideLoading()
      })
    }
  }
})