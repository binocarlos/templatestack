'use strict'

const options = require('template-tools/src/utils/options')
const Knex = require('knex')

const REQUIRED_CONNECTION = [
  'host',
  'user',
  'password',
  'database'
]

const DEFAULT_CONNECTION = {
  port: 5432
}

const DEFAULT_OPTS = {
  client: 'pg',
  pool: {
    min: 0,
    max: 10
  }
}

const KnexFactory = (opts) => {
  opts = opts || {}
  opts = options.processor(opts, {
    default: DEFAULT_OPTS,
  })

  opts.connection = options.processor(opts.connection || {}, {
    required: REQUIRED_CONNECTION,
    default: DEFAULT_CONNECTION
  })
  
  opts.debug = typeof(opts.debug) == 'boolean' ? opts.debug : process.env.NODE_ENV != 'production'
  return Knex(opts)
}

module.exports = KnexFactory