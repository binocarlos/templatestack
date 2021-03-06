const tape = require('tape')
const tools = require('./date')

tape('date range', (t) => {
  const start = new Date(2017, 10, 10)
  const end = new Date(2017, 10, 15)

  const range = tools.getRange(start, end)

  t.equal(range.length, 6, 'correct length')
  t.equal(range[0].getDate(), 10, 'first day correct')
  t.equal(range[5].getDate(), 15, 'last day correct')

  t.end()
})

tape('date strings', (t) => {
  
  // 10th June
  const dateString = '2017-06-10'
  const date = new Date(dateString)

  t.equal(date.getMonth(), 5, 'june')
  t.end()
})
