import event from 'event';

let translations = {};

function loadTl(tl) {
  translations = tl
  event.emit('tlReady')
}

function tl(page, save = true) {
  return new Promise((resolve, reject) => {
    if (hasTl()) {
      if (save) page.setData({ tl: translations })
      resolve(translations)
    } else {
      page.tlReady = () => {
        if (save) page.setData({ tl: translations })
        resolve(translations)
      }
      event.on('tlReady', page, page.tlReady)
    }
  })
}

function hasTl() {
  return Object.keys(translations).length
}

exports.loadTl = loadTl;
exports.tl = tl;
