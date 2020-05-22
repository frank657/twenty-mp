// pages/events/create/components/input.js
Component({

  properties: {
    title: { type: String, value: '' },
    info: { type: String, value: null }
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
    showInfo() {
      const { info } = this.data
      wx.showModal({
        content: info,
        showCancel: false,
        confirmText: 'OK'
      })
    }
  }
})
