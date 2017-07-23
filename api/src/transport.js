'use strict'

const HemeraTransport = require('template-api/src/transport/hemera')
const settings = require('./settings')

const Transport = () => {
  return HemeraTransport({
    host: settings.natshost,
    port: settings.natsport
  })
}

module.exports = Transport