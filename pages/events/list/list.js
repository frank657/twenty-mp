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
    const { pageTitle } = options
    this.setData({ pageTitle })
    wx.hideShareMenu();
    this.getData()
  },

  onReachBottom() {
    if (this.data.hasNextPage) { 
      this.setData({ showLoading: true })
      this.getData()
    }
  },

  getData() {
    const data = { type: 'viewed', page: this.nextPage() }
    wx.bc.getData('events/load_more', { data, shouldSetData: false })
      .then(res => {
        const events = [...this.data.events, ...res.events]
        this.setData({ showInitialLoad: false, showLoading: false, 
          events, hasNextPage: !res.last_page })
      })
  },

  nextPage() {
    const page = this.data.page + 1
    this.setData({ page })
    return page
  },

  toggleList() {
    this.setData({ showUpcoming: !this.data.showUpcoming })
  },

  onShareAppMessage(options) {
    const defaultMsg = {
      title: '加一 PlusOne • Your event manager',
      imageUrl: '/images/placeholder.jpg',
      path: `/pages/index/index`
    }

    if (options.target&&options.target.dataset.event) {
      const e  = options.target.dataset.event
      const t = e.start_time
      let h = parseInt(t.time) 
      const i = t.time.indexOf(':')
      const m = t.time.slice(i+1, i+3)
      const mm = m=='00'?'':`:${m}`
      const date = `${parseInt(t.month_num)}/${parseInt(t.date)} ${h}${mm}${t.time.includes('PM')?'pm':'am'} `
      return {
        title: date + e.title,
        imageUrl: e.image,
        path: `/pages/events/show/show?id=${e.id}`
      }
    } else {
      return defaultMsg
    }
  }
})