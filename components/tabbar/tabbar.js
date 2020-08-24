const BC = require('../../libs/bc.js');

// components/tabbar/tabbar.js
Component({
  /**
   * Component properties
   */
  properties: {
    pageCur: { type: String },
    tabs: { type: Array, value: [] }
  },

  /**
   * Component initial data
   */
  data: {
    colorTab: "#cdcdcd",
    colorTabCur: "#FF6F3C"
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
