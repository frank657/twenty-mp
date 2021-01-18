// pages/events/form/signup-open.js
Component({
  properties: {
    event: Object
  },

  data: {
    signupInfo: "When the signup is closed, users cannot register themselves for your event. You can toggle between open or close at any time from your profile page or from the event page.",
  },

  attached() {
    this.page = this.selectOwnerComponent()
  },

  methods: {
    selectSignupOpen(e) { 
      const { event } = this.data
      event.signup_opens = e.currentTarget.dataset.select
      this.page.setData({ event }) 
    },
  }
})
