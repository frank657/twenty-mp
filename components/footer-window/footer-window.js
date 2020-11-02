// components/footer-window/footer-window.js
Component({
  properties: {

  },

  data: {
    show: false
  },

  attached() {
    this.owner = this.selectOwnerComponent()
    this.owner.closeFooterWindow = () => this.owner.setData({ showFooterWindow: false })
    setTimeout(() => {
      this.setData({ show: true })
    }, 100);
  },

  methods: {
    closeFooterWindow() {
      this.setData({ show: !this.data.show})
      setTimeout(() => {
        this.owner.closeFooterWindow()
      }, 300);
    }
  }
})
