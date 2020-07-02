const BC = require('../../libs/bc.js');
const app = getApp()

Page({
  data: {
    pageName: 'indexMain', //DON'T CHANGE THIS
    showLanding: true,
    tabbarActive: true,
    navbarActive: true,
    pageCur: 'tab1',
    tabbar: [
      {tab: 'tab1', name: 'events', icon: '/images/tabbar/tab1.svg', iconCur: '/images/tabbar/tab1Cur.svg'},
      {tab: 'tab2', name: 'profile', icon: '/images/tabbar/tab2.svg', iconCur: '/images/tabbar/tab2Cur.svg'}
    ]
  },

  onLoad(options) {
    if (options.tab) {this.setData({pageCur: options.tab})}
  },
  onShow: function () {
    if (!this.data.showLanding) wx.showLoading()
    BC.getData('events', this, false).then(res=>{
      this.setData({events: res, showLanding: false})
      wx.hideLoading()
    })
  },
  onShareAppMessage: function () {
    return {
      title: '加一 PlusOne • Your event manager',
      imageUrl: '/images/placeholder.jpg',
      path: `/pages/index/index`
    }
  }
})
