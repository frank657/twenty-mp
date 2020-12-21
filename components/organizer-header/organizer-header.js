const BC = require('../../libs/bc');

Component({
  properties: {
    organization: { type: Object, value: {} },
    t: Object,
    profile_type: Array
  },

  data: {
    // profile_type: ['Public profile', 'Private profile']
  },

  methods: {
    selectProfileType(e) {
      const is_private = e.detail.value == 1
      if (is_private != this.data.organization.is_private) {
        wx.showLoading()
        const url = BC.getHost() + `organizations/${this.data.organization.id}`
        BC.put(url, {organization: {is_private}}).then(res => {
          const { organization } = this.data
          organization.is_private = res.organization.is_private
          this.setData({ organization })
          wx.hideLoading()
        })
      }
    },

    previewImages(e) {
      const { index } = e.currentTarget.dataset
      const urls = this.data.organization.images.map(img => img.url)
      const current = urls[index]
      wx.previewImage({ current, urls });
    }
  }
})
