// pages/events/attendees/components/avatar.js
Component({
  /**
   * Component properties
   */
  properties: {
    user: { type: Object, value: {} },
    selected: { type: Boolean, value: false },
    selectedId: { type: Number, value: null },
    showBlur: { type: Boolean, value: false }
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
    tapUser() {
      this.triggerEvent('tapUser', {id: this.data.user.id})
    }
  }
})
