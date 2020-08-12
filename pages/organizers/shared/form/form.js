Component({
  properties: {

  },

  data: {
    images: [1,2,3,4]
  },

  methods: {
    updateProfile(e) {
      const that = this
      const { name } = e.detail.value
      console.log(name);
      wx.chooseImage({
        count: 6,
        success(res) {
          console.log(res.tempFilePaths)
          that.setData({ photosToUpload: res.tempFilePaths })
        }
      })
    },
    uploadProfileImg() {
      const that = this
      wx.chooseImage({
        count: 1,
        success(res) {
          that.setData({ profileImgToUpload: res.tempFilePaths })
        }
      })
    }
  }
})
