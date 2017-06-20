'use strict'

const HemeraTransport = require('template-api/src/transport/hemera')

const Hemera = (settings) => {
  return HemeraTransport({
    host: settings.natshost,
    port: settings.natsport
  })
}

module.exports = Hemera