const processOptions = require('template-tools/src/processOptions')
const IORedis = require('ioredis')

const REQUIRED = [
  'host'
]


const DEFAULTS = {
  port: 6379,
  family: 4
}

const Redis = (opts) => {
  opts = processOptions(opts, {
    required: REQUIRED,
    defaults: DEFAULTS,
    throwError: true
  })
  return new IORedis(opts)
}


module.exports = Redis