import regeneratorRuntime from "../../../utils/runtime";

// pages/events/share-canvas/share-canvas.js
Page({

  data: {
    canvasWidth: wx.getSystemInfoSync().safeArea.width - 80,
    canvasHeight: wx.getSystemInfoSync().safeArea.width / 375 * 490
  },

  onLoad(options) {
    wx.showLoading()
    if (options.hasQr=='true') {
      wx.bc.getData(`events/${options.id}`).then(res=>{
        this.createCanvas()
      })
    } else {
      wx.bc.getData(`events/${options.id}/get_qr`).then(res=> {
        this.createCanvas()
      })
    }
  },

  onReady() {
  },

  async init(res) {
    this.canvas = res[0].node
    this.ctx = this.canvas.getContext('2d')
    this._y = 0
    this._padding = this.relSize(20)

    const { height, width } = res[0]
    this.setPixelRatio(height, width)

    this.drawBg()
    await this.drawImg()
    await this.drawOrganizer()
    await this.drawTitle()
    await this.drawDate()
    await this.drawLocation()
    this.drawFooter() 
    wx.hideLoading()
  },

  async drawFooter() {
    await this.drawLine()
    this.drawQR()
    this.drawTagline()
  },

  drawQR() {
    const padding = this.relSize(20)
    const img = this.canvas.createImage()
    img.src = this.data.event.mp_qr_code

    const canvasWidth = this.data.canvasWidth, right = canvasWidth - this._padding,
          size = this.relSize(80), x = right - size, y = this._y + padding

    img.onload = () => {
      this.ctx.drawImage(img, x, y, size, size)
      this._y = this._y + padding + size
      // this.setData({ canvasHeight: this._y + padding})
    }
  },

  drawTagline() {
    const paddingTop = this.relSize(50)
    const x = this._padding, y = this._y + paddingTop,
          fontSize = this.relSize(14),
          title = '+one', desc = ['Event organizer for', 'communities']
    let height = 0

    const addHeight = () => height = height + fontSize + this.relSize(6)
    this.ctx.font = `bold ${fontSize}px Arial`
    this.ctx.fillStyle = '#FF6F3C'    
    this.ctx.fillText(title, x, y + height)
    addHeight()
    this.ctx.font = `${fontSize}px Arial`
    this.ctx.fillStyle = '#6D6D6D'    
    this.ctx.fillText(desc[0], x, y + height)
    addHeight()
    this.ctx.fillText(desc[1], x, y + height)    
  },

  drawLine() {
    return new Promise((resolve, reject) => {
      const paddingTop = this.relSize(20)
      const x = this._padding, y = this._y + paddingTop,
            canvasWidth = this.data.canvasWidth,
            lineWidth = canvasWidth - this._padding * 2
      this.ctx.strokeStyle = '#d6d6d6'
      this.ctx.lineWidth = 0.5
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x+lineWidth, y);
      this.ctx.stroke();
      this._y = y
      resolve({ height: paddingTop })
    })
  },

  async drawLocation() {
    return new Promise(async(resolve, reject) => {
      const paddingTop = this.relSize(45),
            img = this.canvas.createImage(),
            imgSize = this.relSize(20), 
            y = this._y + paddingTop, x = this.padding,
            params = [this._padding, y, imgSize, imgSize]
      
      img.src = '/images/icons/map-pin.png'
      img.onload = () => {      
        this.ctx.drawImage(img, ...params)  
      }
      
      const textX = this._padding + imgSize + this.relSize(10), 
            text = this.data.event.venue_name,
            maxWidth = (this.data.canvasWidth - textX - this._padding)/1.2,
            lines = this.getLines(this.ctx, text, maxWidth),
            fontSize = this.relSize(14)
      let height = 0
      const textY = this._y + paddingTop + this.relSize(16)

      // for (let i = 0; i < lines.length; i++) {      
      //   this.ctx.fillText(lines[i], textX, textY + height)
      //   height += fontSize + this.relSize(6)
      // }
      this.ctx.fillText(lines[0] + (lines.length>1?'..':''), textX, textY + height)
      height += fontSize + this.relSize(6)
      this._y += height += paddingTop
      resolve({ height })
    })
  },

  async drawDate() {
    return new Promise((resolve, reject) => {
      const paddingTop = this.relSize(45)
      const { ui_date } = this.data.event
      const textX = this._padding, textY = this._y + paddingTop,
            date = [ui_date[4], ui_date[5]],
            fontSize = this.relSize(14)
      let height = 0
  
      this.ctx.font = `${fontSize}px Arial`
      this.ctx.fillStyle = '#6D6D6D'
      
      for (let i = 0; i < date.length; i++) {      
        this.ctx.fillText(date[i], textX, textY + height)
        height += fontSize + this.relSize(6)
      }
      this._y += height
      resolve({ height })
    })
  },

  async drawTitle() {
    return new Promise((resolve, reject) => {
      const paddingTop = this.relSize(35)
      const textX = this._padding, textY = this._y + paddingTop,
            maxWidth = (this.data.canvasWidth - this._padding * 2)/1.2,
            text = this.data.event.title,
            lines = this.getLines(this.ctx, text, maxWidth),
            fontSize = this.relSize(20)
      let height = 0
  
      this.ctx.font = `bold ${fontSize}px Arial`
      this.ctx.fillStyle = '#FF6F3C'
      
      // for (let i = 0; i < lines.length; i++) {      
      //   this.ctx.fillText(lines[i], textX, textY + height)
      //   height += fontSize
      // }
      this.ctx.fillText(lines[0] + (lines.length>1?'..':''), textX, textY + height)
      height += fontSize
      
      this._y += height
      resolve({ height })
    })
  },

  async drawOrganizer() {
    return new Promise(async(resolve, reject) => {
      const avSize = await this.drawAvatar()
      this.drawOrganizerName(this._padding + avSize.width)
      this._y += avSize.height
      resolve({ height: this._y })
    })
  },

  drawOrganizerName(x) {
    const padding = this.relSize(16)
    const textX = padding + x
    let textY = this._y + this.relSize(25)

    const text = this.data.creator.name
    const maxWidth = (this.data.canvasWidth - padding - x - this._padding)/1.8
    const lines = this.getLines(this.ctx, text, maxWidth)
    
    this.ctx.font = `bold ${this.relSize(16)}px Arial`
    this.ctx.fillStyle = '#155263'
    this.ctx.fillText(lines[0], textX, textY)
    if (lines[1]) this.ctx.fillText(lines[1], textX, textY + 20)
  },

  async drawAvatar() {
    return new Promise((resolve, reject) => {
      const img = this.canvas.createImage()
      const src = this.data.creator.avatar
      img.src = src
      
      const size = this.relSize(65), radius = this.relSize(25), 
            y = this._y - this.relSize(20)
      const params = [this._padding, y, size, size]
  
      img.onload = () => {      
        this.ctx.save();
        this.roundedImage(...params, radius);
        this.ctx.clip();
        this.ctx.drawImage(img, ...params)
  
        this.ctx.restore();
      }

      resolve({ width: size, height: size - this.relSize(20) })
    })

  },

  getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
  },

  roundedImage(x,y,width,height,radius) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
  },

  async drawImg() {
    return new Promise(async (resolve, reject) => {
      const canvasWidth = this.data.canvasWidth
      const defaultHeight = this.relSize(180)

      const img = this.canvas.createImage()
      const src = this.data.event.image
      const imgData = await wx.getImageInfo({ src })
      img.src = src
      
      const sSize = this.getSSize(imgData, {width: canvasWidth, height: defaultHeight})
      const dParams = [0, 0, canvasWidth, defaultHeight]

      img.onload = () => {
        this.ctx.drawImage(img, ...sSize, ...dParams)
        this._y = defaultHeight
        resolve(defaultHeight)
      }
    })
  },

  getSSize(imgSize, targetSize) {
    console.log('sizes', imgSize, targetSize)
    const adjustedTarget = {}
          adjustedTarget.width = imgSize.width
          adjustedTarget.height = imgSize.width / targetSize.width * targetSize.height

    let x, y, width, height;
    if (adjustedTarget.height > imgSize.height) {
      // cut width
      y = 0, height = imgSize.height, width = adjustedTarget.width, x = (imgSize.width - width) / 2
    } else {
      // cut height
      x = 0, width = imgSize.width, height = adjustedTarget.height, y = (imgSize.height - height) / 2
    }
    return [x, y, width, height]
  },

  drawBg() {
    const { canvasWidth, canvasHeight } = this.data
    this.ctx.fillStyle = '#FFFDF8'
    this.ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  },

  createCanvas() {
    const query = wx.createSelectorQuery()
    query.select('#event-poster')
      .fields({ node: true, size: true })
      .exec(this.init)
  },

  setPixelRatio(height, width) {
    const dpr = wx.getSystemInfoSync().pixelRatio
    console.log('canvas size', this.canvas, dpr, height, width)
    this.canvas.width = width * dpr
    this.canvas.height = height * dpr
    this.ctx.scale(dpr, dpr)
  },  

  relSize(size) {
    const defaultSize = 375
    const { screenWidth } = wx.getSystemInfoSync()
    return screenWidth / defaultSize * size
  },

  async saveToAlbum() {
    const scope = "scope.writePhotosAlbum"
    const page = this
    wx.getSetting({
      success(res) {
        if (res.authSetting[scope] == false) {
          wx.openSetting({
            success: (res) => {
              if (res.authSetting[scope]) page.save()
            },
          });
        } else {
          page.save()
        }
      }
    })
  },

  getCanvasUrl: function () {
    return new Promise((resolve, reject) => {
      const { canvas } = this
      const page = this
      wx.canvasToTempFilePath({
        canvas, w: 0, y: 0, destWidth: canvas.width, bgHeight: canvas.height,
        success(res) {
          // wx.hideLoading()
          resolve(res.tempFilePath)
        }
      });
    })
  },

  async save() {
    const url = await this.getCanvasUrl()

    wx.saveImageToPhotosAlbum({
      filePath: url,
      success(res) {
        console.log(res);
        wx.showToast({
          title: "Saved",
        });
      },
      fail(res) {
        console.log('failed show modal?', res)
        wx.hideLoading();
      },
    });
  },

})