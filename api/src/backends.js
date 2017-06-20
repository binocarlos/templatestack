'use strict'

// all the backends - we can split up later
const AuthBackend = require('template-api/src/auth/backend')
const SQLUserStorage = require('template-api/src/auth/sql_storage')

const Backend = (settings, databases, transport) => {
  SQLUserStorage(transport, {})
  AuthBackend(transport, {})
}

module.exports = Backend