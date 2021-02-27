const BC = require('../../../../libs/bc');
const regeneratorRuntime = require('../../../../utils/runtime');

Component({
  properties: {
    organization: Object,
    t: Object
  },

  data: {
    upload: {
      org_avatar: {},
      images: {}
    }
  },

  ready() {
    // this.initOrganizer()
  },

  methods: {
    initOrganizer() {
      console.log(this)
    },

    async uploadImages(e) {
      this.uploadFile('images')
    },

    uploadProfileImg() {
      this.uploadFile('org_avatar')
    },

    async uploadFile(name) {
      const that = this
      const images = await wx.p.chooseImage({count: 1})

      const { upload } = this.data
      upload[name].url = images[0]

      this.setData({ ['upload'+name]: images[0] })

      const fileData = { url: this.getImgUploadPath(), filePath: images[0], name: name }
      const onProgressUpdate = res => {
        upload[name].progress = res.progress
        this.setData({ upload })
        // console.log(this.data.upload[name])
      }

      const uploadRes = await wx.p.uploadFile(fileData, onProgressUpdate)
      if (uploadRes.statusCode==200) that.setData({ organization: JSON.parse(uploadRes.data).organization })
      upload[name] = {}
      this.setData({ upload })
    }, 
    
    getImgUploadPath() {
      return `${BC.getHost()}organizations/${this.data.organization.id}/upload_image`
    },
    
    async deletePhoto(e) {
      const att_id = e.detail.image.attachment_id      
      const path = `${BC.getHost()}organizations/${this.data.organization.id}/destroy_image`
      const deleteRes = await BC.del(path, { attachment_ids: [att_id] })
      this.setData({ organization: deleteRes.organization})
    },
    
    updateProfile(e) {
      wx.showLoading()
      const { name } = e.detail.value
      const path = `${BC.getHost()}organizations/${this.data.organization.id}`
      BC.put(path, { name }).then(res => {
        wx.hideLoading()
        wx.navigateBack()
      })
    },
  }
})