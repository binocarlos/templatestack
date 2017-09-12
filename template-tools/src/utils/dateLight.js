const today = new Date()
const utcParts = (date) => {
  date = date || new Date()
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()
  return {
    year,
    month,
    day
  }
}

const sqlDate = (date, trim = false) => {
  const dateString = typeof(date) === 'string' ? date : date.toISOString()
  return trim ? dateString.split('T')[0] : dateString
}

// turn 16.3 into {hour:16,minute:30}
const getTime = (t = 0) => {
  const h = Math.floor(t)
  const m = Math.round((t - h) * 60)
  return {
    hour: h,
    minute: m || 0
  }
}

// given a number like 16.3 add some minutes (delta) then return an object with hour, minutes
const addTime = (t, delta) => {
  const time = getTime(t)
  const deltaTime = getTime(delta/60)
  return {
    hour: time.hour + deltaTime.hour,
    minute: time.minute + deltaTime.minute
  }
}

const convertTimeToDate = (t) => {
  const ret = new Date()
  ret.setHours(t.hour)
  ret.setMinutes(t.minute)
  ret.setSeconds(0)
  return ret
}

module.exports = {
  today,
  utcParts,
  sqlDate,
  getTime,
  addTime,
  convertTimeToDate
}