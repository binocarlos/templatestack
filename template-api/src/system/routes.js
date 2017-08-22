'use strict'

const options = require('template-tools/src/utils/options')
const urlparse = require('url').parse
const async = require('async')

const webserverTools = require('../webserver/tools')

const REQUIRED = [
  'client'
]

const DEFAULTS = {
  
}

const SystemRoutes = (opts) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const client = opts.client

  const version = (req, res) => {
    client.version({}, (err, version) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(version)
    })
  }

  return {
    version
  }
}

module.exports = SystemRoutes