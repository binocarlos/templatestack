'use strict'

const AuthBackend = require('template-api/src/auth/backend')
const InstallationBackend = require('template-api/src/installation/backend')
const SystemBackend = require('template-api/src/system/backend')

const AuthStorage = require('template-api/src/auth/storage_sql')
const InstallationStorage = require('template-api/src/installation/storage_sql')

const Hooks = require('./hooks')

const packageJSON = require('../../package.json')

const Backend = (transport, databases) => {

  const hooks = Hooks(transport, databases)

  SystemBackend(transport, {
    version: packageJSON.version
  })

  AuthStorage(transport, {
    knex: databases.knex
  })

  InstallationStorage(transport, {
    knex: databases.knex
  })
  
  AuthBackend(transport, {
    hooks: hooks.auth
  })

  InstallationBackend(transport, {
    hooks: hooks.installation
  })
}

module.exports = Backend