Component({
  properties: {
    events: { type: Array, value: [], observer() { this.setData({ swiperCur: 0 })} },
    noEventText: { type: String, value: 'No events' },
    cardType: { type: String, value: 'event' },
    hideUnpublished: { type: Boolean, value: false },
    moreBtn: String
  },

  data: {
    swiperCur: 0
  },

  methods: {
    compTriggeredEvent(e) {
      this.triggerEvent('compTriggeredEvent', e.detail) 
    },

    swipeChange(e) {
      let swiperCur = e.detail.current
      // console.log(swiperCur)
      // const eventCount = this.data.events.length
      // if (swiperCur == eventCount) swiperCur -= 1
      // this.setData({ swiperCur })
    }
  }
})
