'use strict'

const options = require('template-tools/src/options')
const knex = require('knex')

const REQUIRED = [
  'host',
  'user',
  'password',
  'database'
]

const DEFAULTS = {
  port: 5432
}

const Knex = (opts) => {
  opts = opts || {}
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS,
    throwError: true
  })

  return knex({
    client: 'pg',
    connection: opts,
    pool: {
      min: 0,
      max: 7
    }
  })
}

module.exports = Knex