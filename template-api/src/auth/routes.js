'use strict'

const options = require('template-tools/src/options')
const urlparse = require('url').parse
const async = require('async')

const webserverTools = require('../webserver/tools')

const REQUIRED = [
  
]

const DEFAULTS = {
  extractUsername: (req) => req.body.username,
  extractPassword: (req) => req.body.password
}

const AuthRoutes = (transport, opts) => {

  opts = options.process(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  // QUERIES

  const status = (req, res) => {
    res
      .status(200)
      .json({
        loggedIn: req.user ? true : false,
        data: req.user
      })
  }

  // COMMANDS

  const login = (req, res, next) => {
    const username = opts.extractUsername(req)
    const password = opts.extractPassword(req)

    if(!username) return webserverTools.errorReply(next, res, 'no username given', 400)
    if(!password) return webserverTools.errorReply(next, res, 'no username given', 400)

    transport.act({
      topic: 'auth',
      cmd: 'login',
      username,
      password
    }, (err, user) => {
      if(err) return webserverTools.errorReply(next, res, err)
      if(!user) return webserverTools.errorReply(next, res, err, 403)
      res
        .status(200)
        .json(user)
    })
  }

  const register = (req, res, next) => {
    const data = req.body || {}
    
    transport.act({
      topic: 'auth',
      cmd: 'register',
      data
    }, (err, user) => {
      if(err) return webserverTools.errorReply(next, res, err)
      if(!user) return webserverTools.errorReply(next, res, err, 400)
      res
        .status(201)
        .json(user)
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
    var redirectTo = urlparse(req.url, true).query.redirect || '/'
    req.session.destroy(function () {
      res.redirect(redirectTo)
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