"use strict";
const moment = require('moment')
const dateTools = require('../utils/date')

const doesCalendarMatchDay = (calendarItem, date) => {
  
  const dayMatch = calendarItem.days ? 
    dateTools.isDateWithinDays(calendarItem.days, date) :
    true

  const dateMatch = calendarItem.dates ?
    dateTools.isDateWithinRange(calendarItem.dates, date) :
    true

  return dayMatch && dateMatch
}

// return block array based on the schedule values
const processSchedule = (schedule) => {
  const blocks = schedule.blocks || []
  const mergeValues = schedule.merge || {}
  const meta = schedule.meta || {}

  return blocks.map((block, blockindex) => {
    
    const slots = (block.slots || []).map((slot, slotindex) => {

      return Object.assign({}, mergeValues, {
        index: blockindex + '-' + slotindex
      }, slot)
      

      let returnSlot = {
        index: blockindex + '-' + slotindex,
        start: slotValues.start,
        duration: slotValues.duration,
        price: price,
        notes: slotValues.notes,
        description: schedule.description,
        filled: false,
        booking: null,
        location: slotValues.location
      }

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

// get an object with hour, minute based on a single integer
const getSlotTitle = (slot) => {
  if(!slot) return ''
  return dateTools.timeRangeTitle(slot.date, slot.duration)
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