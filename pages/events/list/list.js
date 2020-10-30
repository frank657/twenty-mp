import share from 'share-msg';
import moreList from '../show-more-list';

// pages/events/list/list.js
Page({
  data: {
    pageTitle: 'Events',
    showUpcoming: true,
    showLoading: false,
    showInitialLoad: true,
    events: [],
    page: 0
  },

  onLoad: function (options) {
    wx.hideShareMenu();
    options.isOrganization ? this.loadOrgData(options) : this.loadEventData(options)
    console.log(options)
    this.getData()
  },

  // INITIALIZE DATA
  loadOrgData(options) {
    const isOrganization = true
    const organization = { id: 1 }
    this.setData({ isOrganization, organization })

    // const data = { type: 'past', page: 1 }
    // wx.bc.getData('organizations/1/events', { data })
  },

  loadEventData(options) {
    const { eventType, listTime, isOrganization } = options
    const pageData = listTime ? moreList[eventType][listTime] : moreList[eventType]
    this.setData({ pageData, showUpcoming: listTime == 'upcoming' })
  },

  onReachBottom() {
    if (this.data.hasNextPage) { 
      this.setData({ showLoading: true })
      this.getData()
    }
  },

  getData() {
    const { isOrganization, showUpcoming, pageData } = this.data
    let type;
    if (isOrganization) {
      type = showUpcoming ? 'upcoming' : 'past'
    } else { 
      type = pageData.typeParam
    }

    const data = { type, page: this.nextPage() }
    console.log(data)
    wx.bc.getData(this.getUrl(), { data, shouldSetData: false })
      .then(res => {
        const events = [...this.data.events, ...res.events]
        this.setData({ showInitialLoad: false, showLoading: false, 
          events, hasNextPage: !res.last_page, organization: res.organization })
      })
  },

  nextPage() {
    const page = this.data.page + 1
    this.setData({ page })
    return page
  },

  getUrl() {
    if (this.data.isOrganization) {
      return `organizations/${this.data.organization.id}/events`
    } else {
      return 'events/load_more'
    }
  },

  toggleList() {
    const page = 0;
    const events = [];
    const showUpcoming = !this.data.showUpcoming;
    this.setData({ showInitialLoad: true, showUpcoming, page, events })

    if (!this.data.isOrganization) {
      const listTime = showUpcoming ? 'upcoming' : 'past';
      const { typeParam, eventType } = this.data.pageData
      const pageData = moreList[eventType][listTime]  
      this.setData({ pageData })
    }
    
    this.getData()
  },


  onShareAppMessage(options) { return share(options) }
})