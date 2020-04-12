const BC = require('../../../libs/bc');
const BU = require('../../../libs/bc-utils');
const app = getApp();
// pages/events/create/create.js
Page({
  data: {

  },
  onLoad() {
    BC.userInfoReady(this)
  },

  signIn() {
    BC.getUserInfo()
  },
})