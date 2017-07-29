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
  const h = Math.round(t)
  const m = (t % 1) * 100
  return {
    hour: h,
    minute: m || 0
  }
}

// given a number like 16.3 add some minutes then return an object with hour, minutes
const addTime = (t, delta) => getTime(t + (delta / 60))

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