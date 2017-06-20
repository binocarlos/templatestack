'use strict'

const AuthBackend = require('template-api/src/auth/backend')
const SQLUserStorage = require('template-api/src/auth/sql_user_storage')

const Auth = (settings, databases, transport) => {
  SQLUserStorage(transport)
  return AuthBackend(transport, {

  })
}

module.exports = Auth