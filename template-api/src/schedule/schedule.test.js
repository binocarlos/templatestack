const tape = require('tape')
const schedule = require('./schedule')
const fixtures = require('./fixtures/schedule')

tape('peak schedule', (t) => {
  const data = fixtures.schedule_templates.peak
  const day = schedule(data)
  
  t.equal(day.meta, data.meta, 'meta is the same')
  t.equal(day.blocks.length, data.blocks.length, 'blocks same length')
  t.equal(day.blocks[0].slots[0].price, data.merge.price, 'price was inherited')
  t.notEqual(day.blocks[3].slots[0].price, data.merge.price, 'overriden price was not inherited')
  t.equal(day.blocks[3].slots[0].price, data.blocks[3].slots[0].price, 'price was overridden')
  t.equal(day.blocks[0].name, data.blocks[0].name, 'block name carried forward')
  t.equal(day.blocks[2].slots[2].index, '2-2', 'slot index correct')

  t.end()
})
