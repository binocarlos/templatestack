'use strict'

const options = require('../utils/options')
const webserverTools = require('template-api/src/webserver/tools')
const tools = require('./tools')

const REQUIRED = [
  
]

const DEFAULTS = {
  
}

const LEVELS = {
  viewer: 10,
  editor: 20
}

const InstallationAccess = (transport, opts) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const getInstallationId = (req, urlParam) => req.params[urlParam || 'id']

  const getLevel = (type) => LEVELS[type] || 0
  const isAllowed = (required, actual) => getLevel(actual) >= getLevel(required)

  const handler = (requiredPermission, urlParam) => (req, res, next) => {
    const userid = req.userid
    urlParam = urlParam || 'id'
    const id = parseInt(req.params[urlParam])
    if(isNaN(id)) return webserverTools.errorReply(next, res, 'access denied - no installation id present', 403)
    transport.act({
      topic: 'installation',
      cmd: 'permission',
      id,
      userid
    }, (err, actualPermission) => {
      if(err) return webserverTools.errorReply(next, res, `access denied - ${err.toString()}`, 403)
      if(!isAllowed(requiredPermission, actualPermission)) return webserverTools.errorReply(next, res, `access denied - ${requiredPermission} level needed`, 403)
      next()
    })
  }

  const viewer = (urlParam) => handler('viewer', urlParam)
  const editor = (urlParam) => handler('editor', urlParam)

  return {
    viewer,
    editor
  }
}

module.exports = InstallationAccess