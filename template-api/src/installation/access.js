'use strict'

const options = require('template-tools/src/utils/options')
const webserverTools = require('template-api/src/webserver/tools')
const tools = require('./tools')

const REQUIRED = [
  'client'
]

const DEFAULTS = {
  
}

const LEVELS = {
  viewer: 100,
  editor: 200,
  owner: 300
}

const InstallationAccess = (opts) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const client = opts.client

  const extractId = (req, extractor) => {
    extractor = extractor || 'installationid'
    if(typeof(extractor) == 'string') return req.params[extractor]
    if(typeof(extractor) == 'function') return extractor(req)
    return null
  }

  const getInstallationId = (req, urlParam) => req.params[urlParam || 'id']

  const getLevel = (type) => LEVELS[type] || 0
  const isAllowed = (required, actual) => getLevel(actual) >= getLevel(required)

  const permissionFilter = (requiredPermission) => (collaboration) => {
    return isAllowed(requiredPermission, collaboration.meta.permission)
  }

  const handler = (filterfn, extractor, title = 'access') => (req, res, next) => {
    if(!req.user) return webserverTools.errorReply(next, res, 'access denied - not logged in', 403)
    const userid = req.user.id
    const id = parseInt(extractId(req, extractor))
    if(isNaN(id)) return webserverTools.errorReply(next, res, 'access denied - no installation id present', 403)

    client.user_collaborations({
      id: id,
      userid: userid
    }, (err, collaborations) => {
      if(err) return webserverTools.errorReply(next, res, `access denied - ${err.toString()}`, 403)
      collaborations = (collaborations || []).filter(filterfn)
      if(!collaborations || collaborations.length <=0) return webserverTools.errorReply(next, res, `access denied - ${title} level needed`, 403)
      next()
    })
  }

  const viewer = (extractor) => handler(permissionFilter('viewer'), extractor, 'viewer')
  const editor = (extractor) => handler(permissionFilter('editor'), extractor, 'editor')
  const owner = (extractor) => handler(permissionFilter('owner'), extractor, 'owner')

  return {
    viewer,
    editor,
    owner,
    handler
  }
}

module.exports = InstallationAccess