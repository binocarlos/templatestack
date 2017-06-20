'use strict'

const Auth = require('./auth')

const Backend = (settings, databases, transport) => {
  transport.ready(() => {
    Auth(settings, databases, transport)  
  })
}

module.exports = Backend