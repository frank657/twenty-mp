const BC = require('libs/bc.js');
let dev;
// dev = true

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
    version: '1.1.3',
    lang: 'en', // cn or en
    userInfo: null,
    // env: 'dev',
    env: dev?'dev':'prod',
    host: {
      prod: 'https://twenty.brainchild-tech.cn',
      stag: 'https://twenty-staging.brainchild-tech.cn',
      dev: 'http://localhost:3000'
    },
    api: '/api/v1/',
  },
})