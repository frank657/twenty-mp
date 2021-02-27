// pages/events/show/attendees.js
Component({
  properties: {
    event: Object
  },
  
  data: {
    
  },
  
  methods: {
    openShareMenu() {
      this.selectOwnerComponent().setData({ showShareMenu: true })
    }
  }
})
