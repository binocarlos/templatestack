'use strict'

const Client = require('template-api/src/grpc/client')

const Clients = (backends) => {
  return Object.keys(backends).reduce((all, field) => {
    const backend = backends[field]
    if(typeof(backend) != 'object') throw new Error(`${field} backend not found`)
    all[field] = Client(field, backend)
    return all
  }, {})
}

module.exports = Clients