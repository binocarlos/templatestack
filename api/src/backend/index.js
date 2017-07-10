'use strict'

const AuthBackend = require('template-api/src/auth/backend')
const InstallationBackend = require('template-api/src/installation/backend')
const AuthStorage = require('template-api/src/auth/storage_sql')
const SystemBackend = require('template-api/src/system/backend')

const packageJSON = require('../../package.json')

const Backend = (transport, databases) => {

  SystemBackend(transport, {
    version: packageJSON.version
  })

  AuthStorage(transport, databases)
  
  AuthBackend(transport)
  InstallationBackend(transport, {
    createDefaultInstallation: true
  })
  
}

module.exports = Backend