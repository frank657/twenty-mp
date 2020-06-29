Component({
  properties: {
    title: {type: String},
    index: {type: Number},
    disable: {type: Boolean, value: false}
  },

  data: {

  },

  methods: {
    buttonClick() {
      console.log('buttton clicked, title:', this.data.title, 'index', this.data.index)
      let action = this.data.title == '+' ? 'add' : 'remove'
      this.triggerEvent('plusclicked', {action: action, index: this.data.index})
    },
  }
})
