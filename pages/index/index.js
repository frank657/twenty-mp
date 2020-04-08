//index.js
const app = getApp()

Page({
  data: {
    pageName: 'indexMain', //DON'T CHANGE THIS
    landingActive: false,
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
    setTimeout(() => { this.setData({landingActive: false}) }, 1500); //to be changed
    console.log('page', this)
  }
})
