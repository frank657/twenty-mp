// components/card/card-h.js
Component({
  /**
   * Component properties
   */
  properties: {
    t: { type: Object, value: {} },
    event: { type: Object, value: {} },
    cardType: { type: String, value: 'event' },
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
    shareEvent() {
      wx.bc.thisPage().setData({ showShareMenu: true, shareEvent: this.data.event })
    },
  }
})
