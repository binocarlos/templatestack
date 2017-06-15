"use strict";
const pricetools = require('./prices')
const dates = require('./dates')

// turn a single section into an array of objects
// each represents a cost to the quote
// each object has:
//  * amount
//  * title
//
const EXTRACTORS = {
  number: (section, values) => {
    const count = values[section.id] || 0
    return {
      id: section.id,
      title: section.title,
      value: count
    }
  },
  checkbox: (section, values) => {
    return {
      id: section.id,
      title: section.title,
      value: values[section.id] ? values.children : 0
    }
  },
  radio: (section, values) => {
    return {
      id: section.id,
      title: section.title,
      value: values[section.id]
    }
  },
  multiple_checkbox: (section, values) => {
    return {
      id: section.id,
      title: section.title,
      value: (values[section.id] || []).join(', ')
    }
  }
}

const INFO_FIELDS = [
  'mobile',
  'notes'
]

const REMOVE_OPTIONS = {
  children: true,
  adults: true
}

const bookingSchedule = (quoteme_blocks, options, info, meta) => {
  const sections = quoteme_blocks
    .reduce((all, block) => all.concat(block.sections), [])

  const baseItems = [{
    id: 'bookingid',
    value: meta.bookingid
  },{
    id: 'price',
    value: pricetools.title(meta.slot.price)
  }]

  const infoItems = INFO_FIELDS.map(field => {
    return {
      id: field,
      value: info[field]
    }
  })
  const optionsItems = sections
    .filter(section => REMOVE_OPTIONS[section.id] ? false : true)
    // extract the input into individual costs
    .map(section => {
      const extractor = EXTRACTORS[section.input_type]
      return extractor(section, options)
    })
    
  return baseItems
    .concat(infoItems)
    .concat(optionsItems)
    .filter(section => section.value)
}

const HIDE_SECTIONS = {
  
}

const rangeSchedule = (bookings) => {
  return (bookings || [])
    .reduce((all, booking) => {
      const bookingDate = new Date(booking.name)
      const sqlDay = dates.getSQLDate(bookingDate, true)
      let day = all.map[sqlDay] || {
        date: bookingDate,
        bookings: []
      }
      day.bookings.push(booking)
      if(!all.map[sqlDay]) {
        all.days.push(day)
      }
      all.map[sqlDay] = day
      return all
    }, {
      map: {},
      days: []
    })
    .days
    .map(day => {
      return {
        title: dates.getDateTitle(day.date),
        bookings: day.bookings.map(booking => {
          const bookingDate = new Date(booking.name)
          const meta = booking.meta || {}
          const options = meta.options || {}
          const costs = meta.costs || {}
          const info = meta.info || {}

          const quoteme_blocks = meta.quoteme_blocks || []

          const sections = bookingSchedule(quoteme_blocks, options, info, meta)
            .filter(section => HIDE_SECTIONS[section.id] ? false : true)

          const children = options.children || 0
          const adults = options.adults || 0

          return {
            title: dates.getSlotTitle(meta.slot),
            age: info.age,
            child_name: info.child_name,
            children,
            adults,
            sections
          }
        })
      }
    })
}

module.exports = {
  bookingSchedule,
  rangeSchedule
}