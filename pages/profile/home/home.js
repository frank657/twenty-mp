const app = getApp();
const BC = require('../../../libs/bc');

Component({
  properties: {

  },

  data: {
    userInfo: app.globalData.userInfo,
    showUpcoming: true,
    profile_type: ['Public profile', 'Private profile']
  },

  ready() {
    this.getOrganization()
    BC.userInfoReady(this)

  },
  
  pageLifetimes: {
    show() { 
      this.getOrganization()
    },
  },

  methods: {
    signIn() {
      BC.getUserInfo()
    },
    
    getOrganization() {
      if (!app.globalData.userInfo) {
        app.orgRcb = (res) => { this.getData() } 
      } else {
        this.getData()
      }
    },
    getData() {
      const org_id = app.globalData.userInfo.organization.id
      BC.getData(`organizations/${org_id}`, this)
    },
    changeUpcoming() {
      this.getData()
      this.setData({showUpcoming: !this.data.showUpcoming})
    },
    selectProfileType(e) {
      const is_private = e.detail.value == 1
      if (is_private != this.data.organization.is_private) {
        wx.showLoading()
        const url = BC.getHost() + `organizations/${this.data.organization.id}`
        BC.put(url, {organization: {is_private}}).then(res => {
          const { organization } = this.data
          organization.is_private = res.organization.is_private
          this.setData({ organization })
          wx.hideLoading()
        })
      }
    }
  }
})
