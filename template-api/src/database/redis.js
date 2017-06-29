'use strict'

const options = require('../utils/options')
const IORedis = require('ioredis')

const REQUIRED = [
  'host'
]


const DEFAULTS = {
  port: 6379,
  family: 4
}

const Redis = (opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS,
    throwError: true
  })
  return new IORedis(opts)
}


module.exports = Redis