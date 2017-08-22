"use strict";
const tape = require('tape')
const async = require('async')
const tools = require('./tools')

const headers = tools.headers

const SystemTests = (opts = {}) => {
  tape('system - version', (t) => {
    

    tools.request({
      method: 'GET',
      url: tools.url('/version'),
      json: true
    }, tools.wrapResult((err, result) => {
      if(err) t.error(err)

      t.equal(result.statusCode, 200, '200 code')
      t.equal(result.body.version, opts.version, 'versions same')
      t.end()
    }))
    
    
  })
}

module.exports = SystemTests