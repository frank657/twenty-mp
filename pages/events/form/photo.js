// pages/events/form/photo.js
Component({
  properties: {
    event: Object,
    showError: Boolean
  },

  data: {

  },

  attached() {
    this.page = this.selectOwnerComponent()
  },

  methods: {
    hideError() {
      this.setData({ showError: false })
    },

    uploadImage() {
      const that = this
      wx.chooseImage({
        count: 1,
        success (res) {
          const tempFilePaths = res.tempFilePaths
          const { event } = that.data
          event.imageToUpload = tempFilePaths[0]
          that.page.setData({ event })
        }
      })
    },

    removeImage() {
      const { event } = this.data
      delete event.imageToUpload
      delete event.image
      this.page.setData({ event })
    },
  }
})
