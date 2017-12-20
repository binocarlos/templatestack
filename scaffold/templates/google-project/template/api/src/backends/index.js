'use strict'

const Client = require('template-api/src/grpc/client')

const SystemBackend = require('template-api/src/system/backend')
const AuthBackend = require('template-api/src/auth/backend')

const AuthMemoryStorage = require('template-api/src/auth/storage_memory')
const AuthSQLStorage = require('template-api/src/auth/storage_sql')

const Knex = require('../databases/knex')

const UserBackend = require('./user')
const packageJSON = require('../../package.json')

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
    displayUser: (user) => {
      user = Object.assign({}, user)
      delete(user.salt)
      delete(user.hashed_password)
      delete(user.created_at)
      delete((user.meta || {}).googleToken)
      return user
    }
  })

  const user = UserBackend({
    knex
  })

  return {
    system,
    auth,
    user
  }
}

module.exports = Backends