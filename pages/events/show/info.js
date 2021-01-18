// pages/events/show/info.js
Component({
  properties: {
    event: Object,
    creator: Object
  },

  data: {

  },

  methods: {
    openMap() {
      const e = this.data.event
  
      wx.openLocation({
        name: e.venue_name,
        address: e.address,
        latitude: e.latitude,
        longitude: e.longitude,
      })
    },
  
    navToOrganizer() {
      const url = `/pages/organizers/show/show?id=${this.data.creator.id}`
      wx.navigateTo({ url })
    },
  }
})
