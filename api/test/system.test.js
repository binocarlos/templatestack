"use strict";
const tape = require('tape')
const async = require('async')
const tools = require('./tools')

const packageJSON = require('../package.json')

const headers = tools.headers

tape('system - version', (t) => {
  

  tools.request({
    method: 'GET',
    url: tools.url('/api/v1/version'),
    json: true
  }, tools.wrapResult((err, result) => {
    if(err) t.error(err)

    t.equal(result.statusCode, 200, '200 code')
    t.equal(result.body.version, packageJSON.version, 'versions same')
    t.end()
  }))
  
  
})
