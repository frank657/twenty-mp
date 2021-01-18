const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({ success: res => resolve(res.code) })
  })
}

const getSetting = (scope = null) => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        if (scope) {
          resolve(res.authSetting[`scope.${scope}`])
        } else {
          resolve(res)
        }
      }
    })
  })
}

const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: res => {
        resolve(res.userInfo)
      },
      fail(res){resolve(res)}
    })
  })
}

const showModal = (params) => {
  if (!params.confirmColor) params.confirmColor = '#FF9A3C'
  if (!params.cancelColor) params.cancelColor = '#6d6d6d'
  if (!params.confirmText) params.confirmText = 'OK'
  if (!params.cancelText) params.cancelText = 'Back'
  return new Promise((resolve, reject) => {
    params.success = res => resolve(res)
    wx.showModal(params);
  })
}


const querySelect = (cssId, component) => {
  return new Promise((resolve, reject) => {
    var query = component.createSelectorQuery()
    query.select(`#${cssId}`).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res){
      resolve(res)
    })
  })
}

const chooseImage = (params) => {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: params.count,
      success(res) {
        resolve(res.tempFilePaths)
      }
    })
  })
}

// const uploadFile = (params) => {
//   params.header = getApp().globalDataheaders
//   return new Promise((resolve, reject) => {
//     params.success = res => resolve(res)
//     wx.uploadFile(params)
//   });
// }
const uploadFile = (params, progressFunc) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: params.url,
      filePath: params.filePath,
      name: params.name,
      formData: params.formData,
      header: getApp().globalData.headers,
      success: (result)=>{
        resolve(result)
      },
    }).onProgressUpdate(progressFunc);
  })
}

module.exports = {
  login, getSetting, getUserInfo, showModal, uploadFile, querySelect, chooseImage
}
