const app = getApp();
const BC = require("../../../libs/bc");
import moreList from '../show-more-list';
import { tl } from '../../../utils/tl.js';

Component({
  attached() {
    const sysInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sysInfo.statusBarHeight,
    })
  },
  
  properties: {
    events: { type: Object, value: [], observer() { this.loadData() } }
  },

  data: {
    showUpcoming: true,
  },

  ready() {
    // BC.getData('events')
    tl(this, false).then(res =>{
      console.log('home tl res', res)
      this.setData({ t: res.index.events.home })
    })
    this.setData({ moreList })
  },

  methods: {
    loadData() {
      this.setData({approval_version: app.globalData.approval_version, recentCur: 0})
    },

    toggleNav(e) {
      const { showUpcoming } = e.detail
      this.setData({ showUpcoming })
    },

    bindSwipeRecent(e) {
      let recentCur = e.detail.current
      const eventCount = this.data.events.viewed.length
      if (recentCur == eventCount - 1) recentCur -= 1
      this.setData({ recentCur })
      // if (recentCur==this.data.events.viewed.length-1) this.loadMoreRecent()
    },
  }
})
