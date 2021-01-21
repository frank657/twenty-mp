const getInput = (e, page) => {
  const { name, isIndex } = e.target.dataset
  const { value } = e.detail
  const { event } = page.data
  event[name] = value
  page.setData({ event })
}

exports.getInput = getInput