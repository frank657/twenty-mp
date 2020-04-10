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
    events: { type: Object, value: [], observer() {this.setData({settings: app.globalData.settings})} }
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
