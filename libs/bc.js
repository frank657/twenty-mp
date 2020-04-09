const BR = require('bc-requests')
const BU = require('bc-utils')

const launchApp = (app) => {
  userLogin()
  BU.setLanguage(app)
  BU.getSafeArea(app)
  // BU.getFonts()
}

const getHost = () => {
  const d = getApp().globalData
  return d.host + d.api
}

const userLogin = () => {
  return new Promise((resolve, reject) => {
    let app = getApp()
    wx.login({
      success: res => {
        console.log(res)
        login(`${getHost()}login`, res.code).then(res=> {
          console.log('login res ==>', res)
          getUserInfo();
          resolve(res)
        })
      }
    })
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
    console.log('inside getUserInfo')
    wx.getSetting({
      success: res => {
        console.log('wx.getSetting res ==>', res)
        if (res.authSetting['scope.userInfo']) {
          getUserDetails().then(res => {
            if (app.userInfoReadyCallback) app.userInfoReadyCallback('user authorized')
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

const getData = (path, page = thisPage(), shouldSetData = true) => {
  const app = getApp()
  const url = getHost() + path

  return new Promise((resolve, reject) => {
    if (!app.globalData.headers) {
      app.tokenReadyCallback = res => {
        console.log(res)
        BR.get(url).then((res) => {
          console.log('data', res)
          if (shouldSetData) page.setData(res)
          resolve(res)
        })
      }
    } else {
      BR.get(url).then((res) => {
        console.log('data', res)
        if (shouldSetData) page.setData(res)
        resolve(res)
      })
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
  console.log(url)
  return new Promise((resolve, reject) => {
    BR.post(url, { code: code }).then((res) => {
      const app = getApp()
      app.globalData.headers = res.headers
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
