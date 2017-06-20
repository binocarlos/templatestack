'use strict'

const SystemBackend = require('template-api/src/system/backend')
const packageJSON = require('../../package.json')

const System = (settings, transport, databases) => {
  return SystemBackend(transport, {
    version: packageJSON.version
  })
}

module.exports = System