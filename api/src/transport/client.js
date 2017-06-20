'use strict'

const Hemera = require('./hemera')

const ClientTransport = (settings) => {
  return Hemera(settings)
}

module.exports = ClientTransport