const BC = require('../../libs/bc.js');

// components/tabbar/tabbar.js
Component({
  /**
   * Component properties
   */
  properties: {
    pageCur: { type: String },
    tabs: {
      type: Array, 
      value: [
        {tab: 'tab1', name: 'Tab 1', icon: '/images/tabbar/tab1.svg', iconCur: '/images/tabbar/tab1Cur.svg'},
        {tab: 'tab2', name: 'Tab 2', icon: '/images/tabbar/tab2.svg', iconCur: '/images/tabbar/tab2Cur.svg'},
        {tab: 'tab3', name: 'Tab 3', icon: '/images/tabbar/tab3.svg', iconCur: '/images/tabbar/tab3Cur.svg'}
      ]
    }
  },

  /**
   * Component initial data
   */
  data: {
    colorTab: "#d6d6d6",
    colorTabCur: "#000"
  },

  /**
   * Component methods
   */
  methods: {
    tabChange(e) {
      const tabNew = e.currentTarget.dataset.cur
      BC.thisPage().setData({pageCur: tabNew})
    }
  }
})
