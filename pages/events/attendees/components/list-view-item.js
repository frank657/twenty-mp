// pages/events/attendees/components/list-view-item.js
const BC = require("../../../../libs/bc")
Component({

  properties: {
    item: { type: Object },
    event_id: { type: Number },
    showCheckIn: { type: Boolean, value: false }
  },

  data: {
    
  },

  methods: {
    checkIn(e) {
      console.log(e)
      let item = this.data.item
      item['checked_in'] = e.detail.value
      this.setData({ item })
      let data = { user_id: this.data.item.id, attendee: { checked_in: e.detail.value } }
      BC.post(`${BC.getHost()}events/${this.data.event_id}/attendee/checkin`, data).then(res => {
        console.log(res)

      })

    }
  }
})
