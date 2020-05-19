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
    showUpcomingMine: true
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
    }
  }
})
