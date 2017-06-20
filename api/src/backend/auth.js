'use strict'

const AuthBackend = require('template-api/src/auth/backend')
const SQLUserStorage = require('template-api/src/auth/sql_user_storage')

const Auth = (settings, transport, databases) => {
  SQLUserStorage(transport)
  return AuthBackend(transport, {

  })
}

module.exports = Auth