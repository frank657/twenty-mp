// components/navbar/cta-fav.js
Component({
  properties: {

  },

  data: {
    showComponent: true,
    show: false,
  },

  ready() {
    if (this.shouldShow()) {
      console.log('should show cta')
      this.setData({ showComponent: true })
      setTimeout(() => {
        this.showCta()
      }, 4000);
    } else {
      console.log("don't show cta")
    }
  },
  
  methods: {
    showCta() {
      this.setData({ show: true })
      setTimeout(() => {
        this.hideCta()
      }, 5000);
    },
    
    hideCta() {
      this.setData({ show: false })
      setTimeout(() => {
        this.setData({ showComponent: false})
        wx.setStorage({ key: 'favCtaShown', data: true });
      }, 300);
    },

    shouldShow() {
      return !wx.getStorageSync('favCtaShown')
    },
  }
})
