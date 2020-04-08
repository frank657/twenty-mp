// components/card/card.js
Component({
  /**
   * Component properties
   */
  properties: {
    t: { type: Object, value: {} },
    event: { type: Object, value: {} },
    cardType: { type: String, value: 'event' },
    // nav: { type: Number, value: null }
  },

  /**
   * Component initial data
   */
  data: {
    test: 'test message'
  },

  /**
   * Component methods
   */
  methods: {
    navToShow() {
      wx.navigateTo({
        url: '/pages/events/show/show',
      })
    }
  }
})
