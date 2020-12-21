import share from 'share-msg';
import moreList from '../show-more-list';
import { tl } from '../../../utils/tl.js';

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
    tl(this, false).then(res=> this.setData({ t: res.events.list }))
    wx.hideShareMenu();
    options.isOrganization ? this.loadOrgData(options) : this.loadEventData(options)
    console.log(options)
    this.getData()
  },

  // INITIALIZE DATA
  loadOrgData(options) {
    const isOrganization = true
    const { orgId, listTime } = options
    this.setData({ isOrganization, orgId, showUpcoming: listTime == 'upcoming' })
  },

  loadEventData(options) {
    const { eventType, listTime, isOrganization } = options
    const pageData = listTime ? moreList[eventType][listTime] : moreList[eventType]
    this.setData({ eventType, pageData, showUpcoming: listTime == 'upcoming' })
    console.log(123, this.data)
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
      return `organizations/${this.data.orgId}/events`
    } else {
      return 'events/load_more'
    }
  },

  toggleList(e) {
    const page = 0;
    const events = [];
    const showUpcoming = e.detail.showUpcoming;
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