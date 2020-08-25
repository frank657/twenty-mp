class VersionControl {
  constructor(mp, server) {
    this.gd = getApp().globalData
    this.mp = this.versionConverter(mp)
    this.server = this.versionConverter(server)
    this.envChecked = false
    this.shouldRefetch = false
  }

  sayHello() {
    console.log('hello', this)
  }

  setEnv() {
    const { env } = this.gd
    if (env == 'prod') {
      if (!this.shouldStayInProd()) {
        getApp().globalData.env = 'stag'
        this.shouldRefetch = true
      } 
    }
    this.envChecked = true
  }

  shouldStayInProd() {
    const { mp, server } = this
    if (mp.v==server.v) {
      if (mp.f==server.f) {
        if (mp.p==server.p) {
          return true
        } else {
          return mp.p < server.p
        }
      } else {
        return mp.f < server.f
      }
    } else {
      return mp.v < server.v
    }
  }
  
  versionConverter(version) {
    const [v, f, p] = version.split('.').map(x=>parseInt(x))
    return { v, f, p }
  }
}

export default VersionControl;