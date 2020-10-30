// components/toggle-header/toggle-header.js
Component({
  properties: {
    title: String,
    showUpcoming: { type: Boolean, value: true }
  },

  data: {

  },

  methods: {
    toggleNav() {
      const showUpcoming = !this.data.showUpcoming
      this.triggerEvent('toggleNav', { showUpcoming })
    }
  }
})
