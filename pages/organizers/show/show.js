const app = getApp();
const BC = require('../../../libs/bc');

Page({
  data: {
    showUpcoming: true
  },

  onLoad: function (options) {
    BC.getData(`organizations/${options.id}`)
  },

  changeUpcoming() {
    this.setData({showUpcoming: !this.data.showUpcoming})
  },

  followOrganization() {
    const id = this.data.organization.id
    const url = `${BC.getHost()}organizations/${id}/follow`
    BC.get(url).then(res=>{
      console.log('res', res)
      const { organization } = this.data
      organization.followed = res.followed
      this.setData({ organization })
    })
  },

  onPullDownRefresh: function () {

  },

  onShareAppMessage: function () {

  }
})