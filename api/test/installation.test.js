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
    const user = results.user

    const installation = installations.body[0]
    const meta = status.body.data.meta

    t.equal(installations.statusCode, 200, 'installations status 200')
    t.equal(installations.body.length, 1, 'there is 1 eleement in the array')
    t.equal(installations.body[0].name, 'default installation', 'it is the default installation')
    t.equal(installation.id, meta.activeInstallation, 'active installation id is correct')

    t.end()
  })

})

tape('installation - get', (t) => {

  let originalInstallationId = null
  async.waterfall([
    (next) => userQueries.registerAccount(next),
    (user, next) => {
      originalInstallationId = user.meta.activeInstallation
      queries.get(originalInstallationId, next)
    },
    (installation, next) => {
      t.equal(installation.statusCode, 200, 'get installation status 200')
      t.equal(installation.body.id, originalInstallationId, 'originalInstallationId is id')
      userQueries.registerAccount(next)
    },
    (user2, next) => {
      queries.get(originalInstallationId, next)
    },
    (installation, next) => {
      t.equal(installation.statusCode, 403, 'bad get installation status 403')
      t.equal(installation.body.error, "access denied - viewer level needed", 'correct error message')
      next()
    },
  ], (err) => {
    if(err) t.error(err)
    t.end()
  })

})

tape('installations - create installation', (t) => {

  const INSTALLATION_NAME = 'apples install'
  const DATA = {
    name: INSTALLATION_NAME,
    meta: {
      fruit: 'pears'
    }
  }
  async.series({

    user: (next) => userQueries.registerAccount(next),
    create: (next) => queries.create(DATA, next),
    installations: (next) => queries.list(next)

  }, (err, results) => {

    if(err) t.error(err)

    const installations = results.installations.body

    t.equal(installations.filter(i => i.name == INSTALLATION_NAME).length, 1, 'the installation was created')
    t.equal(installations.length, 2, 'there are two installations in total')

    t.end()
  })
})

tape('installations - save installation', (t) => {
  const INSTALLATION_NAME = 'apples install'
  const DATA = {
    name: INSTALLATION_NAME,
    meta: {
      fruit: 'apples'
    }
  }
  const SAVE_DATA = (obj) => {
    return {
      name: INSTALLATION_NAME + '2',
      meta: Object.assign({}, obj.meta, {
        color: 'oranges'
      })
    }
  }
  let obj = null

  async.series({

    user: (next) => userQueries.registerAccount(next),
    create: (next) => queries.create(DATA, (err, r) => {
      if(err) return next(err)
      obj = r.body
      next()
    }),
    save: (next) => queries.save(obj.id, SAVE_DATA(obj), next),
    installation: (next) => queries.get(obj.id, next)

  }, (err, results) => {

    if(err) t.error(err)

    const installation = results.installation.body

    t.equal(installation.id, obj.id, 'id sanity')
    t.equal(installation.name, INSTALLATION_NAME + '2', 'name is correct')
    t.deepEqual(installation.meta, {
      fruit: 'apples',
      color: 'oranges'
    }, 'merged meta-data')
    t.end()
  })
})
