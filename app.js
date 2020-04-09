const BC = require('libs/bc.js');

//app.js
App({
  onLaunch: function () {
    BC.launchApp(this)
  },
  globalData: {
    color: {
      pri: '#FF6F3C',
      sec: '#FF9A3C',
      ter: '#155263',
      white: '#fff',
      none: '',
      background: '#FFFDF8'
    },
    lang: 'en', // cn or en
    userInfo: null,
    api: '/api/v1/',
    host: 'http://localhost:3000'
    // host: 'https://twenty.brainchild-tech.cn'
  }
})