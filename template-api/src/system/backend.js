'use strict'

const options = require('template-tools/src/utils/options')
const async = require('async')

const REQUIRED = [
  'version'
]

const DEFAULTS = {

}


const SystemBackend = (opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const version = (call, done) => {
    done(null, {
      version: opts.version
    })
  }
  
  return {
    version
  }
}

module.exports = SystemBackend