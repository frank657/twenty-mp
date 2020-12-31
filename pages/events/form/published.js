// pages/events/form/published.js
Component({
  properties: {
    event: Object
  },

  data: {
    publishInfo: "If you have a public profile, only your published events will be shown in your profile. You can change the status at any time from your profile page or from the event page. However users who have previously viewed or signed up for this event, can still see the event from their home page.",
  },

  attached() {
    this.page = this.selectOwnerComponent()
  },

  methods: {
    selectPublished(e) { 
      const { event } = this.data
      event.is_published = e.currentTarget.dataset.select
      this.page.setData({ event }) 
    },
  }
})
