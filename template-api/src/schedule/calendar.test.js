const tape = require('tape')
const tools = require('./test.tools')
const Calendar = require('./calendar')
const fixtures = tools.fixtureData()

tape('off grid mid-week should get offpeak', (t) => {
  const data = fixtures.calendar

  // Tue
  const day = Calendar(data, new Date(2016, 10, 1))

  t.equal(day.name, 'Weekday', 'is a weekday')
  t.equal(day.schedule, 'offpeak', 'is offpeak')
  
  t.end()
})

tape('off grid weekend should get peak', (t) => {
  const data = fixtures.calendar

  // Sat
  const day = Calendar(data, new Date(2016, 10, 5))

  t.equal(day.name, 'Weekend', 'is a weekend')
  t.equal(day.schedule, 'peak', 'is peak')
  
  t.end()
})


tape('christmas closure', (t) => {
  const data = fixtures.calendar
  const day = Calendar(data, new Date(2017, 11, 25))

  t.equal(day.name, 'Christmas Closures', 'is Christmas')
  t.equal(day.schedule, 'closure', 'is closure')
  
  t.end()
})

tape('weekday in summer holiday', (t) => {
  const data = fixtures.calendar

  // Fri Aug 4th
  const date = new Date(2017, 7, 4)
  const day = Calendar(data, date)

  t.equal(day.name, 'Birmingham Summer Holidays', 'is Birmingham Summer Holidays')
  t.equal(day.schedule, 'peak', 'is peak')
  
  t.end()
})
