// components/footer-window/footer-window.js
Component({
  properties: {
    title: String,
    trigger: String,
    center: Boolean,
    speed: { type: String, value: '3'}
  },

  data: {
    show: false
  },

  attached() {
    this.owner = this.selectOwnerComponent()
    // this.owner.closeFooterWindow = () => this.owner.setData({ showFooterWindow: false })
    setTimeout(() => {
      this.setData({ show: true })
    }, 100);
  },

  methods: {
    closeFooterWindow() {
      this.setData({ show: !this.data.show})
      setTimeout(() => {
        // this.owner.closeFooterWindow()
        this.owner.setData({ [this.data.trigger]: false })
      }, 300);
    }
  }
})
