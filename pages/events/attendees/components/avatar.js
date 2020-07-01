const BC = require('../../../../libs/bc')

Component({
  properties: {
    user: { type: Object, value: {} },
    eventId: { type: Number, value: null },
    selected: { type: Boolean, value: false },
    selectedId: { type: Number, value: null },
    showBlur: { type: Boolean, value: false }
  },

  data: {

  },

  methods: {
    tapUser() {
      this.triggerEvent('tapUser', {id: this.data.user.id})
    },
    deleteAttendee() {
      console.log('delete')
    },
    checkinAttendee() {
      let user = this.data.user
      wx.showLoading()
      let data = { user_id: user.id, attendee: { checked_in: !user.checked_in } }
      console.log(data)
      BC.post(`${BC.getHost()}events/${this.data.eventId}/attendee/checkin`, data).then(res => {
        console.log(res)
        user.checked_in = res.checked_in
        this.setData({ user })
        BC.thisPage().setData({ selectedId: null })
        wx.hideLoading()
      })
    }
  }
})
