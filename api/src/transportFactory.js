'use strict'

const HemeraTransport = require('template-api/src/transport/hemera')
const Transport = (settings) => () => {
  return HemeraTransport({
    host: settings.natshost,
    port: settings.natsport
  })
}

module.exports = Transport