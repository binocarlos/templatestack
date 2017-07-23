"use strict";

const tape = require('tape')
const async = require('async')
const tools = require('./tools')
const fixtures = require('./fixtures/schedule')

const Transport = require('../src/transport')

const transport = Transport()


tape('schedule - 3 day range', (t) => {

  const dates = {
    from: '2017-07-20',
    to: '2017-07-26'
  }
  
/*
  transport.act({
    topic: 'schedule',
    cmd: 'range',
    installationid: i,
    data
  }, next)
*/
  console.log(JSON.stringify(fixtures, null, 4))
  t.end()
})

tape('close database', (t) => {
  transport.close()
  t.end()
})