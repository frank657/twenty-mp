// pages/events/share-canvas/share-canvas.js
Page({

  data: {

  },

  onReady() {
    this.getCanvasSize() 
    // const ctx = wx.createCanvasContext('event-poster')
    // console.log('here', ctx)
    // ctx.setFillStyle('red')
    // ctx.fillRect(10, 10, 150, 75)
    // ctx.draw()


    const query = wx.createSelectorQuery()
    query.select('#event-poster')
      .fields({ node: true, size: true })
      .exec(this.init)
  },

  init(res) {
    console.log('test', res)
    const canvas = res[0].node
    const ctx = canvas.getContext('2d')


    const dpr = wx.getSystemInfoSync().pixelRatio

    canvas.width = res[0].width * dpr
    canvas.height = res[0].height * dpr
    
    ctx.scale(dpr, dpr)


    const { canvasWidth, canvasHeight } = this.data
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  },

  getCanvasSize() {
    const { width, height } = wx.getSystemInfoSync().safeArea
    this.setData({ canvasHeight: height - 300, canvasWidth: width - 100 })
  }
})