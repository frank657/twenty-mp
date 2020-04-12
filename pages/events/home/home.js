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
    events: { type: Object, value: [], observer() {this.setData({approval_version: app.globalData.approval_version})} }
  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {
    
  }
})
