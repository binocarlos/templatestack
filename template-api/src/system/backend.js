'use strict'

const options = require('template-tools/src/options')
const async = require('async')

const REQUIRED = [
  'version'
]

const DEFAULTS = {

}


const SystemBackend = (hemera, opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const Joi = hemera.exposition['hemera-joi'].joi

  hemera.add({
    topic: 'system',
    cmd: 'version'
  }, (req, done) => {
    done(null, {
      version: opts.version
    })
  })

}

module.exports = SystemBackend