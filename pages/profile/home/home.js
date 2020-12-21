const app = getApp();
const BC = require('../../../libs/bc');
import { tl } from '../../../utils/tl.js';

Component({
  properties: {

  },

  data: {
    userInfo: app.globalData.userInfo,
    showUpcoming: true
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
    compTriggeredEvent(e) {
      const func = e.detail.func
      if (func == 'getData') {
        this.getData()
      }
    },

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
      wx.showLoading()
      const org_id = app.globalData.userInfo.organization.id
      BC.getData(`organizations/${org_id}`, { page: this }).then(res=>{
        tl(this, false).then(tlRes => {
          this.setData({ t: tlRes.profile.home })
          console.log(this.data)
        })
        wx.hideLoading()
      })
    },

    toggleNav(e) {
      const { showUpcoming } = e.detail
      this.setData({ showUpcoming })
      // this.getData()
    }
  }
})
