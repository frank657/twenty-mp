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
      {tab: 'tab1', name: 'tickets', icon: '/images/tabbar/tab1.svg', iconCur: '/images/tabbar/tab1Cur.svg'},
      {tab: 'tab2', name: 'events', icon: '/images/tabbar/tab2.svg', iconCur: '/images/tabbar/tab2Cur.svg'},
      {tab: 'tab3', name: 'contact', icon: '/images/tabbar/tab3.svg', iconCur: '/images/tabbar/tab3Cur.svg'}
    ]
  },

  onLoad: function () {
    console.log('page', this)
    BC.getData('events', this, false).then(res=>{
      this.setData({events: res, showLanding: false})
      console.log('events', res)
    })
  }
})
