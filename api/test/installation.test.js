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

  async.series({
    user: (next) => userQueries.registerAccount(next),
    installations: (next) => queries.list(next),
    status: (next) => userQueries.status(next)
  }, (err, results) => {
    if(err) t.error(err)
    const installations = results.installations
    const status = results.status

    const installation = installations.body[0]
    const meta = status.body.data.meta

    t.equal(installations.statusCode, 200, 'installations status 200')
    t.equal(installations.body.length, 1, 'there is 1 eleement in the array')
    t.equal(installations.body[0].name, 'default installation', 'it is the default installation')
    t.equal(installation.id, meta.activeInstallation, 'active installation id is correct')

    t.end()
  })

})
