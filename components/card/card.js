const app = getApp();
const BC = require('../../libs/bc');

Component({
  properties: {
    t: { type: Object, value: {} },
    event: { type: Object, value: {} },
    cardType: { type: String, value: 'event' },
  },

  data: {
    adminShowMore: ['duplicate', 'edit', 'cancel'],
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
    },
    deleteEvent() {
      const that = this
      wx.showModal({
        cancelColor: '#000',
        cancelText: 'Back',
        confirmText: 'Confirm',
        title: 'Cancel Event',
        content: 'You are about to cancel this event. Do you want to confirm?',
        success(res) { 
          console.log(res)
          if (res.confirm) {
            const path = `${BC.getHost()}/events/${that.data.event.id}`
            BC.del(path).then(res=>{
              console.log(res)
              if (res.status=='success') {
                // if (getCurrentPages().length>1) {
                //   wx.navigateBack()
                // } else {
                //   wx.reLaunch({ url: '/pages/index/index?tab=tab2' })
                // }
                that.triggerEvent('compTriggeredEvent', {func: 'getData'})
              }
            })
          }
        }
      })
    },
    selectOption(e) {
      console.log(e)
      const id = this.data.event.id
      const option = parseInt(e.detail.value)
      switch (option) {
        case 0: 
          wx.navigateTo({ url: `/pages/events/create/create?template=${id}` })
          break;
        case 1:
          wx.navigateTo({ url: `/pages/events/edit/edit?event=${id}` })
          break;
        case 2:
          this.deleteEvent()
          break;
      }
    }
  }
})
