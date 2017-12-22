'use strict'

const options = require('template-tools/src/utils/options')
const webserverTools = require('template-api/src/webserver/tools')

const REQUIRED = [
  
]

const DEFAULTS = {
  
}

const AuthAccess = (opts) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const loggedIn = () => (req, res, next) => {
    if(!req.user) return webserverTools.errorReply(next, res, 'access denied', 403)
    next()
  }

  const filter = (fn) => (req, res, next) => {
    if(!fn(req.user)) return webserverTools.errorReply(next, res, 'access denied', 403)
    next()
  }

  return {
    loggedIn,
    filter
  }
}

module.exports = AuthAccess