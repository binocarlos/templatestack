const Moment = require('moment')
const MomentRange = require('moment-range')
const moment = MomentRange.extendMoment(Moment)
const dateLight = require('./dateLight')

const utcParts = dateLight.utcParts
const sqlDate = dateLight.sqlDate
const getTime = dateLight.getTime
const addTime = dateLight.addTime
const convertTimeToDate = dateLight.convertTimeToDate

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

  const rangeStart = dates.from && (moment(dates.from).isSame(date, 'day') || moment(dates.from).isBefore(date, 'day'))
  const rangeEnd = dates.to && (moment(dates.to).isSame(date, 'day') || moment(dates.to).isAfter(date, 'day'))

  return rangeStart && rangeEnd ? true : false
}


const dateDelta = (date, days) => {
  const d = moment(date)
  d.add(days, 'day')
  return new Date(d.valueOf())
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

const isBeforeToday = (date) => {
  const now = new Date()
  return moment(date).isBefore(now, 'day')
}

const getRange = (start, end) => {
  const range = moment.range(start, end)
  const days = Array.from(range.by('day'))
  return days.map(day => day.toDate())
}

const timeTitle = (t) => getTimeTitle(convertTimeToDate(t))

module.exports = {
  utcParts,
  sqlDate,
  getDateTitle,
  getTimeTitle,
  timeTitle,
  isSameDay,
  isDateAfter,
  isDateBefore,
  isDateWithinDays,
  isDateWithinRange,
  dateDelta,
  getTime,
  addTime,
  convertTimeToDate,
  timeRange,
  timeRangeTitle,
  isBeforeToday,
  getRange
}