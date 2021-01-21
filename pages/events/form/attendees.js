// pages/events/form/attendees.js
import { getInput } from 'form-helper';

Component({
  properties: {
    event: Object,
    showError: Boolean
  },

  data: {
    // maxCapacity: false,
  },

  attached() {
    this.page = this.selectOwnerComponent()
  },

  methods: {
    changeInput(e) { getInput(e, this.page) },

    initCapacity() {
      if (this.data.event.max_capacity) { 
        this.setData({ maxCapacity: true })
      }
    },

    selectMaxCapacity(e) {
      const { limit } = e.currentTarget.dataset
      const focusMaxCap = limit
      this.setData({ focusMaxCap })

      const { event } = this.data
      event.no_limit = !limit
      this.page.setData({ event })
    },
  }
})
