const computedBehavior = require('miniprogram-computed')
const BC = require('../../../libs/bc');
import { tl } from '../../../utils/tl.js';

// pages/events/show/show.js
Page({
  behaviors: [computedBehavior],
  data: {
    // showNotifyUser: true,
    tmplIds: ['xPKgCkbxIH8fHg_A19fVs21l-VrpGAkY-VXtXLpd0SM', "ucS0CihfvS0RYl_opsL_aX5wIYik5kpkFMlTs4K__c4", "d2HtjouxVT4sXQ7ebXIKc18OGGzxIIuyzvLhvKKyutk"],
    showLanding: true,
    showFooterWindow: false,
    showShareMenu: true,
    showAnswer: false, // show already selected answer
    showQuestion: false, // show popup question form
    selectedAnswer: null, // answer to additional question
    answer: null, // yes, no, maybe
    answers: [
      {name: 'yes', label: 'Yes'},
      {name: 'no', label: 'No'},
      {name: 'maybe', label: 'Maybe'}
    ],
    adminPublish: ['Publish event', 'Unpublish event'],
    adminSignup: ['Open signup', 'Close signup'],
    showMore: false,
    scrollTop: 20,
    imageHeight: 250,
  },

  computed: {
    // isCreator: function (data) {
    //   // return data.userInfo.organization.id == data.creator.id
    // },
  },

  closeQuestion() { this.setData({ showQuestion: false }) },
  showFooterWindow() { this.setData({ showFooterWindow: true}) },
  showOverview() { this.setData({ showOverviewWindow: true}) },

  publishEvent(e) {
    const is_published = e.detail.value == '0'
    if (is_published != this.data.event.is_published) {
      const url = `${BC.getHost()}events/${this.data.event.id}`
      BC.put(url, {event: {is_published}}).then(res=>{
        this.setData({event: res.event})
      })
    }
  },

  openSignup(e) {
    console.log('opening signup', e.detail.value)
    const signup_opens = e.detail.value == '0'
    if (signup_opens != this.data.event.signup_opens) {
      const url = `${BC.getHost()}events/${this.data.event.id}`
      BC.put(url, {event: {signup_opens}}).then(res=>{
        this.setData({event: res.event})
      })
    }
  },

  clickMore() { this.setData({showMore: !this.data.showMore}) },

  deleteEvent() {
    const that = this
    wx.showModal({ cancelColor: '#000', cancelText: 'Back', confirmText: 'Confirm', title: 'Cancel Event',
      content: 'Are you sure you want to cancel the event?',
      success(res) {
        console.log(res)
        if (res.confirm) {
          const path = `${BC.getHost()}/events/${that.data.event.id}`
          BC.del(path).then(res=>{
            console.log(res)
            if (res.status=='success') {
              if (getCurrentPages().length>1) {
                wx.navigateBack()
              } else {
                wx.reLaunch({ url: '/pages/index/index' })
              }
            }
          })
        } else if (res.cancel) {
          that.setData({showMore: false})
        }
      }
    })
  },

  selectAnswer(e) { this.setData({selectedAnswer: parseInt(e.detail.value)}) },
  changeAnswer() { this.setData({ showQuestion: true }) },

  submitAnswer(e) {
    wx.showLoading({ title: 'Loading' })
    const data = { attendee: { status: this.data.answer, answer_id: this.data.event.answers[this.data.selectedAnswer]['id'] } }
    if (this.data.selectedAnswer != null) {
      this.submitRsvp(data);
    } else {
      wx.hideLoading()
      wx.showModal({ showCancel: false, confirmText: 'OK', title: 'Failed', content: 'Please choose an answer' })
    }
  },

  join(e) {
    const { answer } = e.currentTarget.dataset
    if (answer!=this.data.attending_status) {
      wx.showLoading({mask: true})
      BC.getUserInfo().then(res=>{
        console.log('userinfo', res)
        if (res.avatar) {
          this.setData({ answer, shouldShowSubscribe: answer == 'yes' })
          const { question } = this.data.event
          if (answer == 'yes' && question && question != '') {
            this.setData({ showQuestion: true })
          } else {
            const data = { attendee: { status: answer } }
            this.submitRsvp(data);
          }
          wx.hideLoading()
        } else {
          wx.hideLoading()
          wx.showModal({ showCancel: false, confirmText: 'OK', title: 'Authorize user info', content: 'Please allow us to obtain user info to continue' })
        }
      })
    }
  },

  joinWithSubscribe(e) {
    const { answer } = e.currentTarget.dataset
    const { question } = this.data.event
    if (answer!=this.data.attending_status) {
      this.subscribeMsg()
      if (answer == 'yes' && question && question != '') {
        this.setData({ showQuestion: true })
      } else {
        const data = { attendee: { status: answer } }
        this.submitRsvp(data);
      }
    }
  }, 

  subscribeMsg() {
    // console.log('here', e.currentTarget.dataset)
    const { tmplIds } = this.data
    const that = this
    wx.requestSubscribeMessage({
      tmplIds,
      complete(res) {
        console.log(res)
        // send user's response back
        if (res.errMsg === "requestSubscribeMessage:ok") {
          delete res.errMsg
          let data = { templates: res }
          BC.post(`${BC.getHost()}events/${that.data.event.id}/log_notification`, data).then(res => {
            const comp = that.selectComponent('#notify')
            if (comp) comp.closeFooterWindow()
            console.log(res)
          })
        }
      }
    })
  },

  submitRsvp(data) {
    BC.post(`${BC.getHost()}events/${this.data.event.id}/attendee`, data).then(res => {
      console.log('signed', res)
      if (res.status == 'success') {
        this.setData({ event: res.event, attending_status: res.attending_status, selected_answer: res.selected_answer })
        wx.showToast({ icon: 'none', title: 'Thank you!' })
        this.setData({ showQuestion: false })
        if (res.event.question != '' && res.selected_answer != null) {
          this.setData({ showAnswer: true })
        }
        if (res.attending_status=='yes'&&this.data.shouldShowSubscribe) this.setData({ showNotifyUser: true })
      } else {
        wx.hideLoading()
        const title = res.title ? res.title : 'Failed to sign up'
        const content = res.msg ? res.msg : 'Please try again'
        wx.showModal({
          showCancel: false,
          confirmText: 'OK',
          title: title,
          content: content
        })
      }
    })
  },

  onShow() {
    this.setData({ showMore: false, screenHeight: wx.getSystemInfoSync().screenHeight, showFooterWindow: false, showShareMenu: false })
    // wx.showLoading({ title: 'Loading' })
    let id;

    if (this.options.scene) {
      console.log('original scene:', this.options.scene)
      let scene = decodeURIComponent(this.options.scene).split("&") // ["id=1"]
      id =  scene[0].split("=")[1] // ["id", "1"]
    } else {
      id = this.options.id
    }

    BC.userInfoReady(this)
    BC.getData(`events/${id}`).then(res=>{
      tl(this, false).then(tlRes=> this.setData({ t: tlRes.events.show }))
      this.setData({ answer: res.attending_status, showLanding: false })
      // this.setData({ answer: res.attending_status, selectedAnswer: res.selected_answer })
      if (res.event.question != ''  && res.selected_answer != null) {
        this.setData({ showAnswer: true })
      }
      wx.hideLoading()
    })
  },

  onShareAppMessage: function () {
    const e = this.data.event
    const t = e.start_time
    let h = parseInt(t.time)
    const i = t.time.indexOf(':')
    const m = t.time.slice(i+1, i+3)
    const mm = m=='00'?'':`:${m}`
    const date = `${parseInt(t.month_num)}/${parseInt(t.date)} ${h}${mm}${t.time.includes('PM')?'pm':'am'} `
    return {
      title: date + e.title,
      imageUrl: e.image,
      path: `/pages/events/show/show?id=${e.id}`
    }
  },

  showImage() {
    const { event } = this.data
    wx.previewImage({
      urls: [event.image_lg],
    })
  },

  scrollChange(e) {
    console.log(e)
    // console.log(e.detail.scrollTop)
    // let imageHeight = 250
    // const scrollTop = e.detail.scrollTop
    // if (scrollTop<=0) imageHeight -= scrollTop
    // this.setData({imageHeight})
  }
})
