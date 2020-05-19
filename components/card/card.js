const app = getApp();
const BC = require('../../libs/bc');

Component({
  properties: {
    t: { type: Object, value: {} },
    event: { type: Object, value: {} },
    cardType: { type: String, value: 'event' },
  },

  data: {
    adminShowMore: ['duplicate', 'edit', 'delete'],
    adminPublish: ['Publish event', 'Unpublish event'],
    adminSignup: ['Open signup', 'Close signup'],
  },

  methods: {
    navToShow() {
      wx.navigateTo({
        url: `/pages/events/show/show?id=${this.data.event.id}`,
      })
    },
    publishEvent(e) {
      const is_published = e.detail.value == '0'
      if (is_published != this.data.event.is_published) {
        const url = `${BC.getHost()}events/${this.data.event.id}`
        BC.put(url, {event: {is_published}}).then(res=>{
          this.setData({event: res.event})
        })
      } 
    },
    openSignup(e) {
      console.log('opening signup', e.detail.value)
      const signup_opens = e.detail.value == '0'
      if (signup_opens != this.data.event.signup_opens) {
        const url = `${BC.getHost()}events/${this.data.event.id}`
        BC.put(url, {event: {signup_opens}}).then(res=>{
          this.setData({event: res.event})
        })
      }
    }
  }
})
