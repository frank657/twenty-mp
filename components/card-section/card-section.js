Component({
  properties: {
    events: { type: Array, value: [], observer() { this.publishedEventCounter() } },
    noEventText: { type: String, value: 'No events' },
    cardType: { type: String, value: 'event' },
    hideUnpublished: { type: Boolean, value: false }
  },

  data: {

  },

  methods: {
    publishedEventCounter() {
      const events = this.data.events
      const publishedEventCounter = events.some(e=>e.is_published)
      this.setData({ publishedEventCounter })
      console.log('counter', this.data)
    }
  }
})
