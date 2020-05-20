const app = getApp();
const BC = require('../../libs/bc.js')

Component({
  properties: {
    shrinkLogo: { type: Boolean, value: false },
    navType: { type: String, value: 'stack' },
    hideTitleBar: { type: Boolean, value: false },
    background: { type: String, value: 'transparent' }
  },
  data: {
    backgroundColor: 'transparent',
    shared: false,
    showLanguages: false,
    showBackButton: false,
    statusBarHeight: 0,
    flagEn: '/images/languages/en.png',
    flagCn: '/images/languages/cn.png',
  },

  attached() {
    const shared = getCurrentPages().length == 1 && BC.thisPage().data.pageName != 'indexMain'
    const lang = app.globalData.lang
    this.setData({ lang, shared })
  },

  methods: {
    hideLanguages() { BC.thisPage().setData({ showOverlay: false }) },
    showLanguages() {
      // const showOverlay = !BC.thisPage().data.showOverlay
      // BC.thisPage().setData({ showOverlay })
      const showLanguages = !this.data.showLanguages
      this.setData({ showLanguages })
    },

    selectLanguage() {
      app.globalData.lang = this.data.lang == 'en' ? 'cn' : 'en'
      wx.reLaunch({ url: '/pages/index/index' })
    },

    goBack: () => {
      wx.navigateBack({ delta: 1 });
    },
    goToProfile: () => {
      console.log('go to profile');
      wx.navigateTo({
        url: '../profile/profile',
      });
    },

    goToHome() {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  },
  ready() {
    if (getCurrentPages().length > 1) {
      this.setData({
        showBackButton: true,
      });
    }
    // Set status
    const sysInfo = wx.getSystemInfoSync();

    this.setData({
      statusBarHeight: sysInfo.statusBarHeight,
    });
  }
});
