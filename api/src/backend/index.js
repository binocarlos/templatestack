'use strict'

const SQLAddons = require('template-api/src/transport/hemera-sql-store-addons')
const AuthBackend = require('./auth')
const SystemBackend = require('./system')

const Backend = (settings, transport, databases) => {
  transport.ready(() => {
    AuthBackend(settings, transport, databases)  
    SystemBackend(settings, transport, databases)
    SQLAddons(transport, databases.knex)
  })
}

module.exports = Backend