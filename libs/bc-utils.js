Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}

const range = (from, to) => {
  return [...Array(to + 1 - from).keys()].map(i => i + from)
  // For letters:
  // return [...Array(to.charCodeAt(0) - from.charCodeAt(0) + 1).keys()].map(i => String.fromCharCode(i + from.charCodeAt(0)))
}

const getToday = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

const getTime = (date = new Date()) => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  return [hour, minute].map(formatNumber).join(':')
}

const getDateFromToday = (y=0) => {
  const date = new Date()
  const year = date.getFullYear() + y
  const month = date.getMonth() + 1 
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase().trim());
}

const getRpx = (px) => { 
  var winWidth = wx.getSystemInfoSync().windowWidth;
   return 750/winWidth*px;
}

const getPx = (rpx) => {
  var winWidth = wx.getSystemInfoSync().windowWidth;
  return winWidth/750*rpx;
}

const setLanguage = (app) => {
  const l = wx.getSystemInfoSync().language
  app.globalData.lang = (l == "zh" || l == "zh_CN" || l == "zh_TW" || l == "zh_HK") ? 'cn' : "en"
  // app.globalData.lang = 'cn'
}

const getSafeArea = (app) => {
  var [tabbar, navbar] = [getPx(140), getPx(140)]
  var { top, bottom, left, right, height, width } = wx.getSystemInfoSync().safeArea
  app.globalData['safeAreaPx'] = { top, bottom, left, right, height, width, tabbar, navbar }
  var [top, bottom, left, right, height, width, tabbar, navbar] = [
    getRpx(top), getRpx(bottom), getRpx(left), getRpx(right), 
    getRpx(height), getRpx(width), getRpx(tabbar), getRpx(navbar)]
  app.globalData['safeAreaRpx'] = { top, bottom, left, right, height, width, tabbar, navbar }
}

const getFonts = () => {
  console.log('loading fonts')
  wx.loadFontFace({
    family: 'Gotham medium',
    source: 'url("https://social-supply-mp.oss-cn-shanghai.aliyuncs.com/fonts/GothamMedium.otf")',
    weight: '500',
    success: (res)=>{
      console.log('font loaded', res)
    }
  })
  wx.loadFontFace({
    family: 'Gotham light',
    source: 'url("https://social-supply-mp.oss-cn-shanghai.aliyuncs.com/fonts/Gotham-Light.otf")',
    weight: '300',
    success: (res)=>{
      console.log('font loaded', res)
    }
  })    
}

const timeUIFormatter = (start, end) => {
  const tot = todayOrTomorrow(start.raw);
  const dateString = tot ? tot : `${start.day}, ${start.date} ${start.month}`;
  console.log('app language', getApp().globalData.lang == 'cn')
  // const until = getApp().globalData.lang == 'cn'
  if (day(start) == day(end)) {
    return [ dateString, `${start.time} - ${end.time}` ]
  } else {
    return [ `${dateString}, ${start.time} until`, `${end.day}, ${end.date} ${end.month}, ${end.time}` ]
  }
}

const todayOrTomorrow = (date) => {
  date = new Date(date)
  const today = new Date()
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  
  if (date.setHours(0,0,0,0) == today.setHours(0,0,0,0)) {
    return 'Today'
  } else if (date.setHours(0,0,0,0) == tomorrow.setHours(0,0,0,0)) {
    return 'Tomorrow'
  } else {
    return false
  }
}
// const months=()=>['January','February','March','April','May','June','July','August','September','October','November','December']
// const days=()=>['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const day = (time) => {
  return time.date + time.month + time.year
}

const querySelect = (cssId, component) => {
  return new Promise((resolve, reject) => {
    var query = component.createSelectorQuery()
    query.select(`#${cssId}`).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res){
      resolve(res)
      // res[0].top       // The upper boundary coordinate of the #the-id node
      // res[1].scrollTop // The vertical scroll position of the display area
    })
  })
  console.log('comp', component)
}

module.exports = {
  formatTime: formatTime,
  getToday: getToday,
  getDateFromToday: getDateFromToday,
  range: range,
  validateEmail: validateEmail,
  getRpx: getRpx,
  getPx: getPx,
  setLanguage: setLanguage,
  getFonts: getFonts,
  querySelect: querySelect,
  getSafeArea: getSafeArea,
  timeUIFormatter: timeUIFormatter,
  getTime
}
