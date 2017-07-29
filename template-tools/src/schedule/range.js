"use strict";

const options = require('../utils/options')
const dateTools = require('../utils/date')
const Calendar = require('./calendar')
const Schedule = require('./schedule')

const REQUIRED = [
  'calendar',
  'schedule',
  'start',
  'end'
]

const DEFAULTS = {
  items: [],
  extractCalendarScheduleName: (day) => day.schedule,
  // return an SQL date string for the items date
  getItemDate: (item) => new Date(item.date),
  // return an array of indexes to find the slot the item is booked for
  getItemSlotIndexes: (item) => {
    const parts = item.slot.split('-')
    return {
      block: parts[0],
      slot: parts[1]
    }
  },
  processSlot: (slot) => slot
}

/*

  items is an array of bookings that will allocated to the slots

  each item is an object with:

   * id
   * date
   * slot
  
*/

const Range = (opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const dateRange = dateTools.getRange(opts.start, opts.end)

  // map of sqldate -> item[]
  const itemDates = opts.items.reduce((all, item) => {
    const itemDate = opts.getItemDate(item)
    const sqlDate = dateTools.sqlDate(itemDate, true)
    let itemArray = all[sqlDate] || []
    itemArray.push(item)
    all[sqlDate] = itemArray
    return all
  }, {})

  return dateRange
    .map(date => {
      const sqlDate = dateTools.sqlDate(date, true)
      const calendarDay = Calendar(opts.calendar, date)
      const scheduleName = opts.extractCalendarScheduleName(calendarDay)
      const scheduleTemplate = opts.schedule[scheduleName]
      if(!scheduleTemplate) throw new Error(`no schedule found for ${date}`)
      const mergeSchedule = Object.assign({}, opts.mergeSchedule, {
        date,
        schedule: scheduleName,
        name: calendarDay.name
      })
      const mergeSlot = Object.assign({}, opts.mergeSlot, {
        schedule: scheduleName
      })
      const schedule = Schedule(scheduleTemplate, {
        mergeSchedule,
        mergeSlot,
        mapSlot: opts.mapSlot
      })
      const items = itemDates[sqlDate] || []
      items.forEach(item => {
        const slotIndexes = opts.getItemSlotIndexes(item)
        const block = schedule.blocks[slotIndexes.block]
        if(!block) throw new Error(`no block found for ${item.id}`)
        const slot = block.slots[slotIndexes.slot]
        if(!slot) throw new Error(`no slot found for ${item.id}`)
        const slotItems = slot._items || []
        slotItems.push(item)
        slot._items = slotItems
      })
      return schedule
    })
}

module.exports = Range