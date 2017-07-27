"use strict";

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

// return the correct calendar entry for the given date
const Calendar = (calendar, date) => {
  const matching = calendar
    .filter(item => doesCalendarMatchDay(item, date))
  if(matching.length <= 0) return null
  return matching.length > 0 ?
    matching[matching.length-1] :
    null
}

module.exports = Calendar