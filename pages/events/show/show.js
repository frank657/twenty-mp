const BC = require('../../../libs/bc');

// pages/events/show/show.js
Page({
  data: {
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
    showMore: false
  },

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

  clickMore() {
    this.setData({showMore: !this.data.showMore})
  },

  deleteEvent() {
    const that = this
    wx.showModal({
      cancelColor: '#000',
      cancelText: 'Back',
      confirmText: 'Confirm',
      title: 'Cancel Event',
      content: 'You are about to cancel this event. Do you want to confirm?',
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

  selectAnswer(e) {
    console.log(e)
    this.setData({selectedAnswer: parseInt(e.detail.value)})
  },

  changeAnswer() {
    this.setData({ showQuestion: true })
  },

  submitAnswer(e) {
    // this.setData({ showQuestion: false })
    wx.showLoading({ title: 'Loading' })
    const data = { attendee: { status: this.data.answer, selected_answer: this.data.selectedAnswer } }
    console.log('data', data)
    this.submitRsvp(data);
  },

  join(e) {
    BC.getUserInfo().then(res=>{
      console.log('userinfo', res)
      if (res.avatar) {
        // wx.showLoading({ title: 'Loading' })
        const { answer } = e.currentTarget.dataset
        this.setData({ answer })  
        console.log(answer)
        console.log('question', this.data.event.question)
        if (answer == 'yes' && this.data.event.question != '') {
          console.log('show question and answers')
          this.setData({ showQuestion: true })
        } else {
          wx.showLoading({ title: 'Loading' })
          const data = { attendee: { status: answer } }
          this.submitRsvp(data);
        }
        
        
      } else {
        wx.showModal({
          showCancel: false,
          confirmText: 'OK',
          title: 'Authorize user info',
          content: 'Please allow us to obtain user info to continue'
        })
      }
    })
  },

  submitRsvp(data) {
    BC.post(`${BC.getHost()}events/${this.data.event.id}/attendee`, data).then(res => {
      console.log('signed', res)
      if (res.status == 'success') {
        this.setData({ event: res.event, attending_status: res.attending_status, selectedAnswer: res.selected_answer })
        wx.showToast({ title: 'Thank you!' })
        this.setData({ showQuestion: false })
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
    this.setData({ showMore: false })
    wx.showLoading({ title: 'Loading' })
    BC.userInfoReady(this)
    BC.getData(`events/${this.options.id}`).then(res=>{
      this.setData({ answer: res.attending_status, selectedAnswer: res.selected_answer })
      if (res.event.question != ''  && res.selected_answer != null) {
        this.setData({ showAnswer: true })
      }
      wx.hideLoading()
    })
  },

  openMap() {
    const e = this.data.event

    wx.openLocation({
      name: e.venue_name,
      address: e.address,
      latitude: e.latitude,
      longitude: e.longitude,
    })
  },

  navToOrganizer() {
    const url = `/pages/organizers/show/show?id=${this.data.creator.id}`
    wx.navigateTo({ url })
  },

  onShareAppMessage: function () {
    const e = this.data.event
    return {
      title: e.title,
      imageUrl: e.image,
      path: `/pages/events/show/show?id=${e.id}`
    }
  }
})