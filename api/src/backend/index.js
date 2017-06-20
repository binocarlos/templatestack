'use strict'

const AuthBackend = require('./auth')
const SystemBackend = require('./system')

const Backend = (settings, transport, databases) => {
  transport.ready(() => {
    AuthBackend(settings, transport, databases)  
    SystemBackend(settings, transport, databases)
  })
}

module.exports = Backend