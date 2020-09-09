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
  chooseImage, uploadFile
}