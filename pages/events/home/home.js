const app = getApp()
// pages/events/home/home.js
Component({
  attached() {
    const sysInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sysInfo.statusBarHeight,
    })
  },
  properties: {
    events: { type: Object, value: [], observer() {this.setData({approval_version: app.globalData.approval_version, recentCur: 0})} }
  },

  /**
   * Component initial data
   */
  data: {
    showUpcomingAtt: true,
    showUpcomingMine: true
  },

  /**
   * Component methods
   */
  methods: {
    changeAttending() {
      this.setData({showUpcomingAtt: !this.data.showUpcomingAtt})
    },
    changeMine() {
      this.setData({showUpcomingMine: !this.data.showUpcomingMine})
    }
  }
})
