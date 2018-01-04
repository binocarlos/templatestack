'use strict'

const Client = require('template-api/src/grpc/client')

const SystemBackend = require('template-api/src/system/backend')

const AuthBackend = require('template-api/src/auth/backend')
const AuthSQLStorage = require('template-api/src/auth/storage_sql')

const InstallationBackend = require('template-api/src/installation/backend')
const InstallationStorage = require('template-api/src/installation/storage_sql')

const DiggerBackend = require('template-api/src/digger/backend')
const DiggerStorage = require('template-api/src/digger/storage_sql')

const Knex = require('./databases/knex')
const packageJSON = require('../package.json')

const Backends = () => {

  const knex = Knex()
  
  const system = SystemBackend({
    version: packageJSON.version
  })

  const auth = AuthBackend({
    storage: AuthSQLStorage({knex}),
    hooks: {
      register: (user, done) => done(),
      create: (user, done) => done()
    },
    removeUserFields: (user) => {
      user = Object.assign({}, user)
      delete((user.meta || {}).googleToken)
      return user
    }
  })

  const installation = InstallationBackend({
    storage: InstallationStorage({knex}),
    hooks: {
      authUpdate: (req, done) => Client('auth', auth).update(req, done),
      authEnsure: (req, done) => Client('auth', auth).ensure(req, done)
    }
  })

  const digger = DiggerBackend({
    storage: DiggerStorage({knex}),
    hooks: {}
  })

  return {
    system,
    auth,
    installation,
    digger,
  }
}

module.exports = Backends