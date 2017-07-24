const tape = require('tape')
const dateTools = require('../utils/date')
const Range = require('./range')
const fixtures = require('./fixtures/schedule')

tape('3 day range with sparse items', (t) => {
  const data = fixtures.calendar

  const items = [{
    id: 1,
    date: new Date(2017, 6, 26),
    slot: '0-1'
  }]

  const start = new Date(2017, 6, 25)
  const end = new Date(2017, 6, 27)
  
  const days = Range({
    calendar: fixtures.calendar,
    schedule: fixtures.schedule_templates,
    start,
    end,
    items
  })

  t.equal(days.length, 3, '3 days in results')
  t.equal(dateTools.sqlDate(days[0].date, true), dateTools.sqlDate(start, true), 'start date is the same')
  t.equal(dateTools.sqlDate(days[2].date, true), dateTools.sqlDate(end, true), 'start date is the same')
  t.equal(days[1].blocks[0].slots[1]._items.length, 1, 'the item is in the correct place')

  t.end()
})
