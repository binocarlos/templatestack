'use strict'

const Auth = require('./auth')
const SQLUserStorage = require('template-api/src/auth/sql_user_storage')

const Backend = (settings, databases, transport) => {
  SQLUserStorage(transport)
  Auth(transport, databases)
}

module.exports = Backend