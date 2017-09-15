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
  const m = Math.round((t - h) * 100)
  return {
    hour: h,
    minute: m || 0
  }
}

// given a number like 16.3 add some minutes (delta) then return an object with hour, minutes
const addTime = (t, delta) => {
  const time = getTime(t)
  const timeMins = (time.hour * 60) + time.minute + delta

  const hour = Math.floor(timeMins / 60)
  const minute = Math.floor(timeMins % 60)

  return {
    hour,
    minute
  }

/*




  // delta = 150 mins
  // deltaHours = 2.5 hrs
  const deltaHours = delta / 60

  // deltaHoursH = 2
  const deltaHoursH = Math.floor(deltaHoursFloat)

  // deltaHoursM = 30
  let deltaHoursM = (deltaHours - deltaHoursH) * 60

  return {
    hour: time.hour + deltaHours,
    minute: time.minute + deltaTime.minute
  }*/
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