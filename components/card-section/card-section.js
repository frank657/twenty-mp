Component({
  properties: {
    events: { type: Array, value: [] },
    noEventText: { type: String, value: 'No events' },
    cardType: { type: String, value: 'event' },
    hideUnpublished: { type: Boolean, value: false },
    eventType: String,
    listTime: String,
    isOrganization: Boolean,
    orgId: Number
  },

  data: {
    swiperCur: 0
  },

  attached() {
    // console.log('hello', this.data.swiperCur)
  },

  methods: {
    compTriggeredEvent(e) {
      this.triggerEvent('compTriggeredEvent', e.detail) 
    },

    swipeChange(e) {
      let swiperCur = e.detail.current
      const eventCount = this.data.events.length
      if (swiperCur == eventCount) swiperCur -= 1
      this.setData({ swiperCur })
    },

    navToList() {
      const { eventType, listTime, isOrganization, orgId } = this.data
      const url = `/pages/events/list/list?listTime=${listTime}&`
      const params = isOrganization ? `isOrganization=true&orgId=${orgId}` : `eventType=${eventType}`
      wx.navigateTo({
        url: url + params,
      });
    }
  }
})
