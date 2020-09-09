const BC = require('../../../libs/bc');

Page({
  data: {
    
  },

  onLoad: function (options) {
    BC.getData(`organizations/${options.id}`, this).then(res=>wx.hideLoading())
  },
})