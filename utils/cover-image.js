class CoverImage {
  constructor(img) {
    this.url = img;
  }
  
  getUrl() {
    console.log(this.url)
  }
}

module.exports = {
  CoverImage: CoverImage
}

// const img = new CoverImage('url')
// img.getUrl()