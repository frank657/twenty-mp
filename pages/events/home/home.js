const app = getApp();
const BC = require("../../../libs/bc");

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
    showUpcomingAtt: true,
    showUpcomingMine: true,
    loadMoreRecent: false
  },

  ready() {
    // BC.getData('events')
  },

  methods: {
    loadData() {
      this.setData({approval_version: app.globalData.approval_version, recentCur: 0})
    },

    changeAttending() {
      this.setData({showUpcomingAtt: !this.data.showUpcomingAtt})
    },
    changeMine() {
      this.setData({showUpcomingMine: !this.data.showUpcomingMine})
    },
    bindSwipeRecent(e) {
      const recentCur = e.detail.current
      this.setData({ recentCur })
      if (recentCur==this.data.events.viewed.length-1) this.loadMoreRecent()
    },
    loadMoreRecent() {
      this.setData({ loadMoreRecent: true })
      console.log('loading more recent')
      setTimeout(() => {
        this.setData({ loadMoreRecent: false })
      }, 3000);
    }
  }
})
