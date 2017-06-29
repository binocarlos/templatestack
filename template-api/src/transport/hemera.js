'use strict'

const options = require('../utils/options')
const Nats = require('nats')
const Hemera = require('nats-hemera')

const REQUIRED = [
  'host'
]

const DEFAULTS = {
  port: 4222,
  logLevel: 'info'
}

const HemeraFactory = (opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS,
    throwError: true
  })
  const nats = Nats.connect(`nats://${opts.host}:${opts.port}`)
  return new Hemera(nats, {
    logLevel: opts.logLevel
  })
}

module.exports = HemeraFactory