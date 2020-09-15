Component({
  properties: {
    events: { type: Array, value: [], observer() { this.setData({ swiperCur: 0 })} },
    noEventText: { type: String, value: 'No events' },
    cardType: { type: String, value: 'event' },
    hideUnpublished: { type: Boolean, value: false }
  },

  data: {
    swiperCur: 0
  },

  methods: {
    compTriggeredEvent(e) {
      this.triggerEvent('compTriggeredEvent', e.detail) 
    }
  }
})
