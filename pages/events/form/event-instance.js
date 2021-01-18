let event = null;

const setEventInstance = (value) => {
  event = value
}

const delEventInstance = () => {
  event = null
}

const getEventInstance = () => {
  return event
}

module.exports = {
  setEventInstance, delEventInstance, getEventInstance
}