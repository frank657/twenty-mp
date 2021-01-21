const BC = require('../../libs/bc.js');
const app = getApp()
import Event from '../../utils/event'
import { tl } from '../../utils/tl.js';

Page({
  data: {
    pageName: 'indexMain', //DON'T CHANGE THIS
    showLanding: true,
    tabbarActive: true,
    navbarActive: true,
    showShareMenu: false,
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
    this.setData({ showShareMenu: false, shareEvent: null })
    if (!this.data.showLanding) wx.showLoading()
    if (app.vc&&app.vc.envChecked) {
      this.getData()
    } else {
      Event.on('getEvents', this, this.getData)
    }
  },

  getData() {
    BC.getData('events', { shouldSetData: false }).then(res=>{
      this.setData({events: res, showLanding: false})
      wx.hideLoading()
    })
  },

  onShareAppMessage(options) {
    const defaultMsg = {
      title: '加一 PlusOne • Your event manager',
      imageUrl: '/images/placeholder.jpg',
      path: `/pages/index/index`
    }

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
    } else {
      return defaultMsg
    }
  },
  
  // onAddToFavorite(res) {
  //   console.log('adding to fav', res)
  // }
})
