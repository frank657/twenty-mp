// pages/events/form/question.js
import { getInput } from 'form-helper';

Component({
  properties: {
    event: Object,
    formType: String,
    showError: Object
  },

  data: {
    questionInfo: "Custom question is useful if you need the attendees to make a choice. For example: 'What are you bringing for picnic?', attendees can choose drinks, bread, salad, etc. In the attendees list, you will then have an overview of the choices made",
  },

  attached() {
    this.page = this.selectOwnerComponent()
  },

  methods: {
    changeInput(e) {
      getInput(e, this.page)
    },

    addRemoveAnswers(e) {
      const action = e.detail.action || e.currentTarget.dataset.action
      const { event } = this.data
      if (action == 'add') {
        if (!event.answers) event.answers = []
        event.answers.push("")
        this.page.setData({ event })
      } else {
        event.answers.splice(e.detail.index, 1)
        this.page.setData({ event })
      }
    },

    addAnswer(e) {
      let answers = this.data.event.answers || []
      const index = e.target.dataset.index
      const value = e.detail.value.trim()
      answers[index].id ? answers[index].content = value : answers[index] = value
      
      const { event } = this.data
      event.answers = answers
      this.page.setData({ event })
      
      console.log('answers:', this.data.event.answers)
    },
  }
})
