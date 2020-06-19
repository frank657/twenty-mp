// pages/events/form/components/plusButton.js
Component({
  /**
   * Component properties
   */
  properties: {
    title: {type: String},
    index: {type: Number}
  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {
    buttonClick() {
      console.log('buttton clicked, title:', this.data.title, 'index', this.data.index)
      let action = this.data.title == '+' ? 'add' : 'remove'
      this.triggerEvent('plusclicked', {action: action, index: this.data.index})
    },
  }
})
