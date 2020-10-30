export default function(options) {
  const defaultMsg = {
    title: '加一 PlusOne • Your event manager',
    imageUrl: '/images/placeholder.jpg',
    path: `/pages/index/index`
  }

  if (options.target&&options.target.dataset.event) {
    const e  = options.target.dataset.event
    const t = e.start_time
    let h = parseInt(t.time) 
    const i = t.time.indexOf(':')
    const m = t.time.slice(i+1, i+3)
    const mm = m=='00'?'':`:${m}`
    const date = `${parseInt(t.month_num)}/${parseInt(t.date)} ${h}${mm}${t.time.includes('PM')?'pm':'am'} `
    return {
      title: date + e.title,
      imageUrl: e.image,
      path: `/pages/events/show/show?id=${e.id}`
    }
  } else {
    return defaultMsg
  }
}