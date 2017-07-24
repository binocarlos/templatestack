const moment = require('moment')

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


const getDateTitle = (date) => moment(date).format("ddd Do MMM, YYYY")

const getTimeTitle = (date) => moment(date).format("HH:mm")

const isSameDay = (date1, date2) => {
  return moment(date1).format('YYYY-MM-DD') == moment(date2).format('YYYY-MM-DD')
}

const isDateAfter = (date1, date2) => {
  return moment(date1).isAfter(date2, 'day')
}

const isDateBefore = (date1, date2) => {
  return moment(date1).isBefore(date2, 'day')
}

// days is an array like 'Mon', 'Tue', 'Wed'
const isDateWithinDays = (days, date) => {
  const dateDay = moment(date).format("ddd").toLowerCase()
  days = days.map(d => d.toLowerCase())
  return days.indexOf(dateDay) >= 0
}

// dates can either be a string (meaning same for from/to)
// or an object with from/to
const isDateWithinRange = (dates, date) => {
  if(typeof(dates) == 'string') {
    return moment(dates).isSame(date, 'day')
  }

  if(dates.constructor === Array) {
    return dates.filter(singleDate => moment(singleDate).isSame(date, 'day')).length > 0
  }

  const rangeStart = moment(dates.from).isSame(date, 'day') || moment(dates.from).isBefore(date, 'day')
  const rangeEnd = moment(dates.to).isSame(date, 'day') || moment(dates.to).isAfter(date, 'day')

  return rangeStart && rangeEnd ? true : false
}


const dateDelta = (date, days) => {
  const d = moment(date)
  d.add(days, 'day')
  return new Date(d.valueOf())
}

const getTime = (t) => {
  const h = Math.round(t)
  const m = (t % 1) * 100
  return {
    hour: h,
    minute: m || 0
  }
}

// return two dates X minutes apart
const timeRange = (startDate, duration) => {
  const start = moment(startDate)
  const end = moment(startDate)
  end.add(duration, 'minutes')
  return {
    start,
    end
  }
}

const timeRangeTitle = (startDate, duration) => {
  const times = timeRange(startDate, duration)
  return [
    getTimeTitle(times.start),
    getTimeTitle(times.end)
  ].join(' - ')
}

module.exports = {
  utcParts,
  sqlDate,
  getDateTitle,
  getTimeTitle,
  isSameDay,
  isDateAfter,
  isDateBefore,
  isDateWithinDays,
  isDateWithinRange,
  dateDelta,
  getTime,
  timeRange,
  timeRangeTitle
}