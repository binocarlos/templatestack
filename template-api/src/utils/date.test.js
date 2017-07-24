const tape = require('tape')
const tools = require('./date')

tape('date range', (t) => {
  

  const start = new Date(2017, 10, 10)
  const end = new Date(2017, 10, 15)

  const range = tools.getRange(start, end)

  console.dir(range)
  t.end()
})
