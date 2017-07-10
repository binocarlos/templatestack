'use strict'

const options = require('../utils/options')
const urlparse = require('url').parse
const async = require('async')

const webserverTools = require('../webserver/tools')

const REQUIRED = [
  
]

const DEFAULTS = {
  
}

const InstallationRoutes = (transport, opts) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  // QUERIES

  const get = (req, res, next) => {
    const id = webserverTools.getIdParam(req)
    if(!installationID) return webserverTools.errorReply(next, res, 'installation id required')
    transport.act({
      topic: 'installation',
      cmd: 'get',
      id,
      userid: req.userid
    }, (err, installation) => {
      if(err) return webserverTools.errorReply(next, res, err)
      if(!installation) return webserverTools.errorReply(next, res, 'installation not found', 404)
      res
        .status(200)
        .json(installation)
    })
  }

  const list = (req, res, next) => {
    transport.act({
      topic: 'installation',
      cmd: 'list',
      userid: accountid: req.userid
    }, (err, installations) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(installations)
    })
  }

  // COMMANDS

  const create = (req, res, next) => {
    transport.act({
      topic: 'installation',
      cmd: 'create',
      data: req.body || {},
      accountid: req.userid
    }, (err, installation) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(201)
        .json(installation)
    })
  }

  const update = (req, res, next) => {
    if(!req.user) return webserverTools.errorReply(next, res, 'not logged in', 403)
    const id = req.user.id
    const data = req.body || {}
    
    transport.act({
      topic: 'auth',
      cmd: 'update',
      id,
      data
    }, (err, user) => {
      if(err) return webserverTools.errorReply(next, res, err)
      if(!user) return webserverTools.errorReply(next, res, err, 400)
      res
        .status(200)
        .json(user)
    })
  }

  const logout = (req, res, next) => {
    const redirectTo = urlparse(req.url, true).query.redirect || '/'
    req.session.destroy(function () {
      if(webserverTools.isJSON(req)) {
        res
          .status(200)
          .json({
            loggedIn: false
          })
      }
      else {
        res.redirect(redirectTo)  
      }
      
    })
  }

  return {
    status,
    login,
    register,
    update,
    logout
  }
}

module.exports = AuthRoutes