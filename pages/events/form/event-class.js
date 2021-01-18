import { thisPage } from "../../../libs/bc";

class Event {
  constructor(page = thisPage(), data = {}) {
    this.data = data
    this.page = page
  }
  
  // changeInput(e, arr=[]) {
  //   const { name, isIndex } = e.target.dataset
  //   const { value } = e.detail
  //   this.data[name] = isIndex ? arr[value] : value
  //   this.set()
  // }

  // manualInput(key, value) {
  //   this.data[key] = value
  //   this.set()
  // }

  loadEvent(event) { this.data = event }
  addDetails(data) {
    console.log('before', this.event)
    this.event = {...this.event, ...data}
    console.log('added', this.event)
  }
  get() { return this.data }
  // set() { this.page.setData({ event: this.event }) }
  set() { console.log('here', this.data) }
}

export default Event