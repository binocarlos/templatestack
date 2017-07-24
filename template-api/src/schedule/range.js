"use strict";

const dateTools = require('../utils/date')
const Calendar = require('./calendar')
const Schedule = require('./schedule')

const REQUIRED = [
  'calendar',
  'schedule',
  'start',
  'end'
]

const Range = (opts) => {
  REQUIRED.forEach(name => {
    if(!opts[name]) throw new Error(`${name} option required`)
  })

  const { calendar, schedule, start, end } = opts
  const items = opts.items || []

  

  
}

module.exports = Calendar