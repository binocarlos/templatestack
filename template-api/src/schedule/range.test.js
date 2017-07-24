const tape = require('tape')
const Range = require('./range')\
const fixtures = require('./fixtures/schedule')

tape('3 day range with sparse items', (t) => {
  const data = fixtures.calendar

  const items = []

  const start = new Date(2017, 6, 25)
  const end = new Date(2017, 6, 27)
  
  const days = Range({
    calendar: fixtures.calendar,
    schedule: fixtures.schedule_templates,
    start,
    end,
    items
  })

  console.log(JSON.stringify(days, null, 4))
  
  t.end()
})
