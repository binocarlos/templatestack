"use strict";
const tape = require('tape')
const async = require('async')
const tools = require('./tools')
const userQueries = require('./queries/user')
const queries = require('./queries/installations')

const headers = tools.headers

tape('installation - post register create', (t) => {

  async.waterfall([
    (next) => userQueries.registerAccount(next),

    (user, next) => {
      const installationid = user.meta.activeInstallation

      t.ok(installationid, 'there is an installationid')
      next()
    }
  ], (err) => {
    if(err) t.error(err)
    t.end()
  })

})

tape('installation - list', (t) => {

  async.waterfall([
    (next) => userQueries.registerAccount(next),
    (user, next) => queries.list(next)
  ], (err, installations) => {
    if(err) t.error(err)
    console.log(JSON.stringify(installations, null, 4))
    t.end()
  })

})
