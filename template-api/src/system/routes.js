'use strict'

const options = require('../utils/options')
const urlparse = require('url').parse
const async = require('async')

const webserverTools = require('../webserver/tools')

const REQUIRED = [
  
]

const DEFAULTS = {
  
}

const SystemRoutes = (transport, opts) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const version = (req, res) => {
    transport.act({
      topic: 'system',
      cmd: 'version'
    }, (err, version) => {
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