// pages/events/attendees/components/list-view-item.js
const BC = require("../../../../libs/bc")
Component({

  properties: {
    item: { type: Object },
    eventId: { type: Number },
    showCheckIn: { type: Boolean, value: false }
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
        item.checked_in = res.checked_in
        this.setData({ item })
        wx.hideLoading()
      })
    },

    removeAttendee(e) {
      if (e.detail.value==0) {
        console.log(this.data.item)
        // BC.del(`${BC.getHost()}attendees/${this.data.item.id}`).then(res=>{
        //   console.log('res', res)
        // })
      }
    }
  }
})
