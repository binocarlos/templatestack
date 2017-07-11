'use strict'

const options = require('../utils/options')
const webserverTools = require('template-api/src/webserver/tools')

const REQUIRED = [
  
]

const DEFAULTS = {
  
}

const AuthAccess = (transport, opts) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const loggedIn = () => (req, res, next) => {
    if(!req.user) return webserverTools.errorReply(next, res, 'access denied', 403)
    next()
  }

  return {
    loggedIn
  }
}

module.exports = AuthAccess