'use strict'

const AuthBackend = require('template-api/src/auth/backend')


const Auth = (settings, databases, transportFactory) => {
  const storage = SQLStorage(settings, databases, transportFactory)
  return AuthBackend(transportFactory, storage, settings)
}

module.exports = Auth