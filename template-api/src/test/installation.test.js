"use strict";
const tape = require('tape')
const async = require('async')
const tools = require('./tools')
const userQueries = require('./queries/auth')
const queries = require('./queries/installations')

const headers = tools.headers

const InstallationTests = (opts = {}) => {
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


  tape('installations - update installation', (t) => {
    const INSTALLATION_NAME = 'apples install'
    const DATA = {
      name: INSTALLATION_NAME,
      meta: {
        fruit: 'apples'
      }
    }
    const UPDATE_DATA = {
      color: 'red'
    }
    let obj = null
    async.series({

      user: (next) => userQueries.registerAccount(next),
      create: (next) => queries.create(DATA, (err, r) => {
        if(err) return next(err)
        obj = r.body
        next()
      }),
      update: (next) => queries.update(obj.id, UPDATE_DATA, next),
      installation: (next) => queries.get(obj.id, next)

    }, (err, results) => {

      if(err) t.error(err)

      const installation = results.installation.body

      t.equal(results.installation.statusCode, 200, '200 code')
      t.deepEqual(installation.meta, Object.assign({}, DATA.meta, UPDATE_DATA), 'meta is merged')

      t.end()
    })
  })

  tape('installations - delete installation', (t) => {
    const INSTALLATION_NAME = 'apples install'
    const DATA = {
      name: INSTALLATION_NAME,
      meta: {
        fruit: 'apples'
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

      del: (next) => queries.del(obj.id, next),
      installations: (next) => queries.list(next)

    }, (err, results) => {

      if(err) t.error(err)

      const installations = results.installations.body

      t.equal(results.del.statusCode, 204, '204 delete code')
      t.equal(installations.length, 1, 'only 1 installation')
      t.equal(installations[0].name, 'default installation', 'the only one is the default')
      t.end()
    })
  })

  tape('installations - activate installation', (t) => {
    
    const INSTALLATION_NAME = 'apples install'
    let obj = null
    const DATA = {
      name: INSTALLATION_NAME,
      meta: {
        fruit: 'apples'
      }
    }
    async.series({

      user: (next) => userQueries.registerAccount(next),

      create: (next) => queries.create(DATA, (err, r) => {
        if(err) return next(err)
        obj = r.body
        next()
      }),

      activate: (next) => queries.activate(obj.id, next),
      status: (next) => userQueries.status(next)

    }, (err, results) => {

      if(err) t.error(err)

      const activeInstallation = results.status.body.data.meta.activeInstallation

      t.equal(typeof(activeInstallation), 'number', 'active installation is number')
      t.equal(activeInstallation, obj.id, 'active installation is created id')

      t.end()
    })
  })


  tape('installations - access control - different user', (t) => {
    const userData1 = userQueries.UserData(1)
    const userData2 = userQueries.UserData(2)
    const INSTALLATION_NAME = 'apples install'

    let installationid = null
    let obj = null
    let users = null
    let status1 = null
    const DATA = {
      name: INSTALLATION_NAME,
      meta: {
        fruit: 'apples'
      }
    }
    async.series({

      user1: (next) => userQueries.register(userData1, next),

      status1: (next) => userQueries.status((err, s) => {
        if(err) return next(err)
        status1 = s
        installationid = s.body.data.meta.activeInstallation
        next()
      }),

      get1: (next) => queries.get(installationid, next),
      put1: (next) => queries.save(installationid, {name:'updated1'}, next),

      logout: (next) => userQueries.logout(next),

      user2: (next) => userQueries.register(userData2, next),

      get2: (next) => queries.get(installationid, next),
      put2: (next) => queries.save(installationid, {name:'updated2'}, next)

    }, (err, results) => {

      if(err) t.error(err)

      t.equal(results.get1.statusCode, 200, 'get1 200')
      t.equal(results.get2.statusCode, 403, 'get2 403')

      t.equal(results.put1.statusCode, 201, 'put1 201')
      t.equal(results.put2.statusCode, 403, 'put2 403')
      
      t.end()
    })
  })



  tape('installations - access control - no user', (t) => {
    const userData1 = userQueries.UserData(1)
    const userData2 = userQueries.UserData(2)
    const INSTALLATION_NAME = 'apples install'

    let installationid = null
    let obj = null
    let users = null
    let status1 = null
    const DATA = {
      name: INSTALLATION_NAME,
      meta: {
        fruit: 'apples'
      }
    }
    async.series({

      user1: (next) => userQueries.register(userData1, next),

      status1: (next) => userQueries.status((err, s) => {
        if(err) return next(err)
        status1 = s
        installationid = s.body.data.meta.activeInstallation
        next()
      }),

      put1: (next) => queries.save(installationid, {name:'updated1'}, next),

      logout: (next) => userQueries.logout(next),

      put2: (next) => queries.save(installationid, {name:'updated2'}, next),

    }, (err, results) => {

      if(err) t.error(err)

      t.equal(results.put1.statusCode, 201, 'get1 201')
      t.equal(results.put2.statusCode, 403, 'get2 403')
      
      t.end()
    })
  })
}

module.exports = InstallationTests