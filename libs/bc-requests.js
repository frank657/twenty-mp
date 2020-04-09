let headers = () => {
  return getApp().globalData.headers
}

let request = (url, data = {}) => {
  return new Promise(
    (resolve, reject) => {
      wx.request({
        url: url,
        header: headers(),
        success: function (res) {
          let data = res.data;
          resolve(data);
        },
        fail: function (res) {
          let error = false;
          reject(error);
        }
      });
    }
  );
}

let post = (url, data = {}) => {
  console.log(url, data)
  return new Promise(
    (resolve, reject) => {
      wx.request({
        url: url,
        header: headers(),
        method: 'POST',
        data: data,
        success: function (res) {
          let data = res.data;
          resolve(data);
        },
        fail: function (res) {
          let error = false;
          reject(error);
        }
      });
    }
  );
}

let put = (url, data = {}) => {
  return new Promise(
    (resolve, reject) => {
      wx.request({
        url: url,
        header: headers(),
        method: 'PUT',
        data: data,
        success: function (res) {
          let data = res.data;
          resolve(data);
        },
        fail: function (res) {
          let error = false;
          reject(error);
        }
      });
    }
  );
}

let del = (url, data = {}) => {
  return new Promise(
    (resolve, reject) => {
      wx.request({
        url: url,
        header: headers(),
        method: 'DELETE',
        data: data,
        success: function (res) {
          let data = res.data;
          resolve(data);
        },
        fail: function (res) {
          let error = false;
          reject(error);
        }
      });
    }
  );
}

let get = (url, data = {}) => {
  url += "?"
  let params = []
  Object.keys(data).forEach(e => {
    if (e.includes("[]")) {
      data[e] = data[e].split(',')
      data[e].forEach(x => { params.push(`${e}=${x}`) })
    } else {
      params.push(`${e}=${data[e]}`)
    }
  })
  url += params.join("&")
console.log('url', url)
  return new Promise(
    (resolve, reject) => {
      wx.request({
        url: url,
        header: headers(),
        method: 'GET',
        // data: data,
        success: function (res) {
          let data = res.data;
          resolve(data);
        },
        fail: function (res) {
          let error = false;
          reject(error);
        }
      });
    }
  );
}

module.exports = {
  request: request,
  post: post,
  del: del,
  get: get,
  put: put
}
