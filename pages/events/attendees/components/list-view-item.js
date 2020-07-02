// pages/events/attendees/components/list-view-item.js
const BC = require("../../../../libs/bc")
Component({

  properties: {
    item: { type: Object },
    eventId: { type: Number },
    showCheckIn: { type: Boolean, value: false },
    isOwner: { type: Boolean, value: false }
  },

  data: {
    
  },

  methods: {
    checkIn(e) {
      let item = this.data.item
      wx.showLoading()
      let data = { user_id: item.id, attendee: { checked_in: !item.checked_in } }
      console.log(data)
      BC.post(`${BC.getHost()}events/${this.data.eventId}/attendee/checkin`, data).then(res => {
        console.log(res)
        BC.thisPage().setData({ attendees: res.event.attendees })
        wx.hideLoading()
      })
    },

    removeAttendee(e) {
      const { item, eventId } = this.data
      if (e.detail.value==0) {
        wx.showModal({
          title: 'Are you sure?',
          content: 'Are you sure you want to remove the attendee?',
          cancelText: 'Back',
          confirmText: 'Confirm',
          success(res) {
            console.log('res', res)
            if (res.confirm) {
              const data = { user_id: item.id, attendee: { status: 'viewed' } }
              BC.post(`${BC.getHost()}events/${eventId}/attendee/checkin`, data).then(res => {
                BC.thisPage().setData({ attendees: res.event.attendees })
              })
            }
          }
        })
      }
    }
  }
})
