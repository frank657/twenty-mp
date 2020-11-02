const BR = require('bc-requests')
const BU = require('bc-utils')
import Event from '../utils/event'
import VersionControl from '../utils/version-control'

const launchApp = (app) => {
  userLogin(app)
  BU.setLanguage(app)
  BU.getSafeArea(app)
  // BU.getFonts()
}

const getHost = () => {
  const d = getApp().globalData
  return d.host[d.env] + d.api
}

const userLogin = (app) => {
  wx.login({
    success: res => {
      login(`${getHost()}login`, res.code).then(res=> {
        console.log('login res ==>', res)
        app.vc = new VersionControl(app.globalData.version, res.settings.version)
        app.vc.setEnv()
        if (app.vc.shouldRefetch) launchApp(app)
        Event.emit('getEvents')
        getUserInfo();
      })
    }
  })
}

const userInfoReady = (page) => {
  const app = getApp()
  const d = app.globalData
  if (app.globalData.userInfoAuth) {
    page.setData({ userInfoAuth: d.userInfoAuth, userInfo: d.userInfo})
  } else {
    app.userInfoReadyCallback = res => {
      console.log('user info callback fired', res)
      page.setData({ userInfoAuth: d.userInfoAuth, userInfo: d.userInfo})
    }
  }
}

const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    const app = getApp()
    wx.getSetting({
      success: res => {
        console.log('wx.getSetting res ==>', res)
        if (res.authSetting['scope.userInfo']) {      
          getUserDetails().then(res => {
            if (app.userInfoReadyCallback) app.userInfoReadyCallback('user authorized')
            if (app.orgRcb) app.orgRcb()
            resolve(res)
          })
        } else {
          resolve('user rejects authorization')
        }
      }
    })
  })
}

const getUserDetails = () => {
  return new Promise((resolve, reject) => {
    console.log('getting user Details')
    const app = getApp()
    wx.getUserInfo({
      success: res => {
        const url = getHost() + 'user/update-info'
        const user = res.userInfo
        user['avatar'] = user.avatarUrl
        user['nickname'] = user.nickName
        delete user['avatarUrl']
        delete user['nickName']
        const userInfo = app.globalData.userInfo
        const userNeedUpdate = !Object.keys(user).every((key)=>{
          return userInfo[key] == user[key]
        })
        app.globalData.userInfoAuth = true
        console.log('user need update', userNeedUpdate)
        if (userNeedUpdate) {
          console.log('inside user need update, url ==>', url)
          BR.put(url, {user: user}).then(res => {
            app.globalData.userInfo = res.user
            console.log('user updated?', res)
            resolve(res)
          })
        } else {
          resolve(user)
        }
      },
      fail(res){resolve(res)}
    })
  })
}

const getUserPhone = () => {
  console.log('getting user Phone')
}

const getData = (path, params = {}) => {
  const app = getApp()
  if (!params.page) params.page = thisPage()
  if (!params.data) params.data = {}
  if (params.shouldSetData == undefined) params.shouldSetData = true
  // page = thisPage(), shouldSetData = true, data = {}

  const getRequest = () => {
    return new Promise((resolve, reject) => {
      BR.get(getHost() + path, params.data).then((res) => {
        console.log('data', res)
        if (params.shouldSetData) params.page.setData(res)
        resolve(res)
      })
    })
  }

  return new Promise((resolve, reject) => {
    if (!app.globalData.headers) {
      app.tokenReadyCallback = res => {
        console.log(res)
        getRequest().then(res => resolve(res))
      }
    } else {
      getRequest().then(res => resolve(res))
    }
  })
}

const thisPage = () => {
  return getCurrentPages().pop()
}

const lastPage = () => {
  return getCurrentPages().slice(-2, -1)[0]
}

const login = (url, code) => {
  return new Promise((resolve, reject) => {
    BR.post(url, { code: code, version: getApp().globalData.version }).then((res) => {
      const app = getApp()
      app.globalData.headers = res.headers
      app.globalData.approval_version = res.approval_version
      app.globalData.settings = res.settings
      app.globalData.userInfo = res.user

      if (app.tokenReadyCallback) {
        app.tokenReadyCallback('headers ready')
      }
      resolve(res)
    })
  })
}

module.exports = {
  launchApp: launchApp,
  thisPage: thisPage,
  lastPage: lastPage,
  login: login,
  getHost: getHost,
  request: BR.request,
  get: BR.get,
  post: BR.post,
  put: BR.put,
  del: BR.del,
  getData: getData,
  userInfoReady: userInfoReady,
  getUserInfo: getUserInfo,
  getUserPhone: getUserPhone
}
