"use strict";
const moment = require('moment')

const isSameDay = (date1, date2) => {
  return moment(date1).format('YYYY-MM-DD') == moment(date2).format('YYYY-MM-DD')
}

// days is an array like 'Mon', 'Tue', 'Wed'
const isDateWithinDays = (days, date, debug) => {
  const dateDay = moment(date).format("ddd").toLowerCase()
  days = days.map(d => d.toLowerCase())
  return days.indexOf(dateDay) >= 0
}

const isDateAfter = (date1, date2) => {
  return moment(date1).isAfter(date2, 'day')
}

const isDateBefore = (date1, date2) => {
  return moment(date1).isBefore(date2, 'day')
}


// dates can either be a string (meaning same for from/to)
// or an object with from/to
const isDateWithinRange = (dates, date, debug) => {
  if(typeof(dates) == 'string') {
    return moment(dates).isSame(date, 'day')
  }

  if(dates.constructor === Array) {
    return dates.filter(singleDate => moment(singleDate).isSame(date, 'day')).length > 0
  }

  if(debug) {
    console.log('-------------------------------------------');
    console.log(date)
    console.dir(dates)
    console.log('from is same: ' + moment(dates.from).isSame(date, 'day'))
    console.log('from is before: ' + moment(dates.from).isBefore(date, 'day'))
    console.log('to is same: ' + moment(dates.to).isSame(date, 'day'))
    console.log('to is isAfter: ' + moment(dates.to).isAfter(date, 'day'))
  }

  const rangeStart = moment(dates.from).isSame(date, 'day') || moment(dates.from).isBefore(date, 'day')
  const rangeEnd = moment(dates.to).isSame(date, 'day') || moment(dates.to).isAfter(date, 'day')

  return rangeStart && rangeEnd ? true : false
}

const doesCalendarMatchDay = (calendarItem, date, debug) => {
  
  const dayMatch = calendarItem.days ? 
    isDateWithinDays(calendarItem.days, date, debug) :
    true

  const dateMatch = calendarItem.dates ?
    isDateWithinRange(calendarItem.dates, date, debug) :
    true

  if(debug) {
    console.log(calendarItem.name)
    console.log('dayMatch: ' + dayMatch)
    console.log('dateMatch: ' + dateMatch)
  }

  return dayMatch && dateMatch
}

const mergeBlockValues = (item, previous) => {
  return Object.assign({}, previous, item)
}

// return block array based on the schedule values
const cascadeScheduleBlocks = (schedule, prices, date, range) => {
  prices = prices || {}
  range = range || []
  const priceChildren = prices.children || {}
  return (schedule.blocks || []).map((block, blockindex) => {
    const blockValues = mergeBlockValues(block, schedule)
    const slots = (block.slots || []).map((slot, slotindex) => {
      const slotValues = mergeBlockValues(slot, blockValues)
      const price = (typeof(slotValues.price) == 'string' ?
        priceChildren[slotValues.price] :
        slotValues.price) || 0
      const injectedDate = injectStartTime(date, slotValues.start)

      let returnSlot = {
        index: blockindex + '-' + slotindex,
        start: slotValues.start,
        duration: slotValues.duration,
        price: price,
        notes: slotValues.notes,
        description: schedule.description,
        date: getSQLDate(injectedDate),
        filled: false,
        booking: null,
        location: slotValues.location
      }

      range.forEach(booking => {
        if(isSlotFilled(booking, injectedDate, returnSlot)) {
          returnSlot.filled = true
          returnSlot.booking = booking
        }
      })

      return returnSlot
    })
    return {
      name: block.name,
      slots
    }
  })
}

// given the calendar and a date - return what type of schedule the date uses
// the calendar is from the config and the date is a javascript date object
const dayInfo = (calendarItems, templates, prices, date, range, debug) => {
  range = (range || []).map(booking => {
    return Object.assign({}, booking, {
      date: new Date(booking.date)
    })
  })

  const matching = calendarItems
    .filter(item => doesCalendarMatchDay(item, date, debug))

  if(matching.length <= 0) return null

  const calendarMatch = matching[matching.length-1]

  if(debug) {
    console.log('have ' + matching.length + ' matches')
    console.log('picked match: ')
    console.dir(calendarMatch)
  }

  const schedule = typeof(calendarMatch.schedule) == 'string' ?
    templates[calendarMatch.schedule] :
    calendarMatch.schedule

  return {
    name: calendarMatch.name,
    date: date,
    description: schedule.description,
    advert: schedule.advert,
    scheduletype: typeof(calendarMatch.schedule) == 'string' ? calendarMatch.schedule : 'custom',
    blocks: cascadeScheduleBlocks(schedule, prices, date, range)
  }
}

const dateDelta = (date, days) => {
  const d = moment(date)
  d.add(days, 'day')
  return new Date(d.valueOf())
}

const getDateTitle = (date) => moment(date).format("ddd Do MMM, YYYY")

const getTimeTitle = (date) => moment(date).format("HH:mm")

// get an object with hour, minute based on a single integer
const getTime = (t) => {
  const h = Math.round(t)
  const m = (t % 1) * 100
  return {
    hour: h,
    minute: m || 0
  }
}

const getSlotTitle = (slot) => {
  if(!slot) return ''
  const startDate = moment(slot.date)
  const endDate = moment(slot.date)
  endDate.add(slot.duration, 'minutes')
  return startDate.format('HH:mm') + ' - ' + endDate.format('HH:mm')
}

// get a single date with the slots start time built in
// return an SQL date
const getCombinedSlotDates = (slot, date) => {
  let d = moment(date)
  const t = getTime(slot.start)
  d.hour(t.hour)
  d.minute(t.minute)
  d.second(0)
  return d.format('YYYY-MM-DD HH:mm:ss')
}

const getSQLDate = (date, notime) => {
  let d = moment(date)
  d.second(0)
  if(notime) {
    return d.format('YYYY-MM-DD')
  }
  else {
    return d.format('YYYY-MM-DD HH:mm:ss')
  }
}

const injectStartTime = (date, start) => {
  let d = moment(date)
  const t = getTime(start)
  d.hour(t.hour)
  d.minute(t.minute)
  d.second(0)
  return new Date(d.valueOf())
}

// is the given slot date/time the same as the booking
const isSlotFilled = (booking, date, slot) => {
  const bookingDate = moment(booking.date)

  const bookingSlotIndex = booking.meta.slot.index || 0
  const slotIndex = slot.index

  if(bookingDate.isSame(date, 'day')) {
    return bookingSlotIndex == slotIndex 
  }
}

const isBeforeToday = (date) => {
  const now = new Date()
  return moment(date).isBefore(now, 'day')
}

module.exports = {
  isSameDay,
  isDateAfter,
  isDateBefore,
  dayInfo,
  dateDelta,
  getDateTitle,
  getTimeTitle,
  getSlotTitle,
  getCombinedSlotDates,
  injectStartTime,
  getSQLDate,
  isSlotFilled,
  isBeforeToday
}