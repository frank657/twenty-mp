const BU = require('../../../libs/bc-utils');

// pages/events/form/time.js
Component({
  properties: {
    event: { type: Object, value: null, observer() { this.initTime() } }
  },

  data: {
    time: '20:00',
    defaultEndTime: '21:00',
    endTimeStart: '00:00',
    today: BU.getToday(),
    lastDate: BU.getDateFromToday(5),
  },

  attached() {
    this.page = this.selectOwnerComponent()
  },

  methods: {
    initTime() {
      const { event, time, defaultEndTime, today, lastDate } = this.data
      const keys = ['start_date', 'start_time', 'end_date', 'end_time']
      if (!keys.every(k=>event[k])) {
        event.start_date = today
        event.start_time = time
        event.end_date = today
        event.end_time = defaultEndTime
        this.page.setData({ event })
      }
    },

    selectStartDate() { this.page.setData({ showStartDate: true }) },
    selectEndDate() { this.page.setData({ showEndDate: true }) },

    // XXXXXXXXXXXXXX
    // NO LONGER USED
    // XXXXXXXXXXXXXX
    bindDateChange(e) {
      const { type } = e.currentTarget.dataset
      const { event } = this.page.data

      // IF END DATE IS BEFORE START, SET SAME DATE
      if (type == 'start') { 
        event.start_date = e.detail.value 
        if (!this.dateEndIsAfterStart(event.start_date, event.end_date)) {
          event.end_date = event.start_date
        }
      }
      if (type == 'end') { event.end_date = e.detail.value }
      
      // IF ITS SAME DATE, SET TIME LIMITS
      if (this.isSameDay(event.start_date, event.end_date)) {
        this.setData({ endTimeStart: event.start_time })
        if (!this.timeEndIsAfterStart(event.start_time, event.end_time)) {
          event.end_time = event.start_time
        }
      } else { 
        this.setData({ endTimeStart: '00:00' })
      }
      
      this.page.setData({ event })
    },
    // XXXXXXXXXXXXXXXXXXXXXXXXX

    setTime(type, date) {
      const { event } = this.page.data

      // IF END DATE IS BEFORE START, SET SAME DATE
      if (type == 'start') { 
        event.start_date = date 
        if (!this.dateEndIsAfterStart(event.start_date, event.end_date)) {
          event.end_date = event.start_date
        }
      }
      if (type == 'end') { 
        event.end_date = date
      }
      
      // IF ITS SAME DATE, SET TIME LIMITS
      if (this.isSameDay(event.start_date, event.end_date)) {
        this.setData({ endTimeStart: event.start_time })
        if (!this.timeEndIsAfterStart(event.start_time, event.end_time)) {
          event.end_time = event.start_time
        }
      } else { 
        this.setData({ endTimeStart: '00:00' })
      }
      
      this.page.setData({ event })
    },
    
    bindTimeChange(e) {
      const { type } = e.currentTarget.dataset
      const { event } = this.page.data
      if (type == 'start') { 
        event.start_time = e.detail.value
        if (this.isSameDay(event.start_date, event.end_date)) {
          if (!this.timeEndIsAfterStart(event.start_time, event.end_time)) {
            event.end_time = event.start_time
          }
        }
      }
      if (type == 'end') { event.end_time = e.detail.value }
      this.page.setData({ event })
    },

    isSameDay(date1, date2) {
      date1 = date1.split('-').map(n=>parseInt(n))
      date2 = date2.split('-').map(n=>parseInt(n))
      return date2.every((n,i) => n==date1[i])      
    },

    dateEndIsAfterStart(start, end) {
      start = start.split('-').map(n=>parseInt(n))
      end = end.split('-').map(n=>parseInt(n))
      return end.every((n,i) => n>=start[i])
    },

    timeEndIsAfterStart(start, end) {
      start = start.split(':').map(n=>parseInt(n))
      end = end.split(':').map(n=>parseInt(n))
      return end.every((n,i) => n>=start[i])
    },
  }
})
