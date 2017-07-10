'use strict'

const AuthBackend = require('./auth')
const SystemBackend = require('./system')

const Backend = (transport, databases) => {
  AuthBackend(transport, databases)
  SystemBackend(transport, databases)
}

module.exports = Backend