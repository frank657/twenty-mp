const BC = require('../../../../libs/bc')

Component({
  properties: {
    user: { type: Object, value: {} },
    eventId: { type: Number, value: null },
    selected: { type: Boolean, value: false },
    selectedId: { type: Number, value: null },
    showBlur: { type: Boolean, value: false },
    isOwner: { type: Boolean, value: false }
  },

  data: {

  },

  methods: {
    tapUser() {
      this.triggerEvent('tapUser', {id: this.data.user.id})
    },
    deleteAttendee() {
      console.log('delete')
      const { user, eventId } = this.data
      wx.showModal({
        title: 'Are you sure?',
        content: 'Are you sure you want to remove the attendee?',
        cancelText: 'Back',
        confirmText: 'Confirm',
        success(res) {
          console.log('res', res)
          if (res.confirm) {
            const data = { user_id: user.id, attendee: { status: 'viewed' } }
            BC.post(`${BC.getHost()}events/${eventId}/attendee/checkin`, data).then(res => {
              BC.thisPage().setData({ selectedId: null, attendees: res.event.attendees })
            })
          }
        }
      })
    },
    checkinAttendee() {
      let { user, eventId } = this.data
      wx.showLoading()
      let data = { user_id: user.id, attendee: { checked_in: !user.checked_in } }
      console.log(data)
      BC.post(`${BC.getHost()}events/${eventId}/attendee/checkin`, data).then(res => {
        // console.log(res)
        // user.checked_in = res.checked_in
        // this.setData({ user })
        // BC.thisPage().setData({  })
        BC.thisPage().setData({ selectedId: null, attendees: res.event.attendees })
        wx.hideLoading()
      })
    }
  }
})
