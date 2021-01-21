// pages/events/form/location.js
import { getInput } from 'form-helper';

Component({
  properties: {
    event: Object,
    showError: Boolean
  },

  data: {
    locationRejected: false
  },

  attached() {
    this.page = this.selectOwnerComponent()
    this.getLocationSetting()
  },

  methods: {
    changeInput(e) {
      getInput(e, this.page)
    },

    getLocationSetting() {
      const that = this
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userLocation']==false) {
            that.setData({ locationRejected: true })
          }
        }
      })
    },

    pinLocation() {
      const that = this
      const scope = 'scope.userLocation'

      if (this.data.locationRejected) {
        console.log('go to settings')
        wx.openSetting({
          success: (res)=>{
            if (res.authSetting[scope]) { 
              that.chooseLocation() 
            } 
          },
        });
      } else {
        this.chooseLocation()
      }
    },

    chooseLocation() {
      const that = this
      const scope = 'scope.userLocation'

      wx.authorize({
        scope,
        success(result) {
          wx.chooseLocation({
            success(res) {
              const { event } = that.data;
              ((data) => (
                ['address', 'longitude', 'latitude'].forEach(k=>event[k]=data[k])
              ))(res)
              event.venue_name = res.name
              console.log(event)
              that.page.setData({ event })
              that.setData({ locationRejected: false })
            },
          })
        },
        fail(res) { that.setData({ locationRejected: true })}
      });

    }
  }
})
