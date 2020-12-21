const BC = require('../../../libs/bc');
import { tl } from '../../../utils/tl.js';

Page({
  data: {
    
  },

  onLoad: function (options) {
    BC.getData(`organizations/${options.id}`).then(res=>{
      tl(this, false).then(tlRes=> this.setData({ t: tlRes.organizers.edit }))
      wx.hideLoading()
    })
  },
})