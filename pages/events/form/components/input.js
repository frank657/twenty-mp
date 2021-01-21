// pages/events/create/components/input.js
Component({

  properties: {
    title: { type: String, value: '' },
    info: { type: String, value: null },
    showError: { type: Boolean, value: false },
  },

  data: {
    
  },

  methods: {
    showInfo() {
      const { info } = this.data
      wx.showModal({
        content: info,
        showCancel: false,
        confirmText: 'OK'
      })
    },

    hideError() {
      this.setData({ showError: false })
    }
  }
})
