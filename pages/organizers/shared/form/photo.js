// pages/organizers/shared/form/photo.js
Component({
  properties: {
    image: Object,
    upload: { type: Boolean, value: false }
  },

  data: {

  },

  methods: {
    deletePhoto() {
      const {image} = this.data
      this.triggerEvent('deletePhoto', {image})
    }
  }
})
