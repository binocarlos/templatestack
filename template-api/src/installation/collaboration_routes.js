'use strict'

const options = require('template-tools/src/utils/options')
const urlparse = require('url').parse
const async = require('async')

const webserverTools = require('../webserver/tools')
const tools = require('./tools')

const REQUIRED = [
  'collaboration_template'
]

const DEFAULTS = {
  topic: 'installation',
  authTopic: 'auth',
  extractInstallation: (req) => {
    const ret = parseInt(req.params.installationid)
    return isNaN(ret) ? null : ret
  },
  extractUser: (body) => body.user || {},
  extractCollaboration: (body) => body.collaboration || {}
}

const CollaborationRoutes = (transport, opts) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const TOPIC = opts.topic
  const AUTH_TOPIC = opts.authTopic
  const extractInstallation = opts.extractInstallation
  const collaboration_template = opts.collaboration_template

  // QUERIES
  const list = (req, res, next) => {

    const i = extractInstallation(req, res, next)
    if(!i) return webserverTools.errorReply(next, res, 'installation required')
    
    transport.act({
      topic: TOPIC,
      cmd: 'list_users',
      id: i,
      meta: collaboration_template
    }, (err, users) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(users)
    })
  }

  const get = (req, res, next) => {

    const id = webserverTools.getIdParam(req, 'id')
    if(!id) return webserverTools.errorReply(next, res, 'id required')
    
    transport.act({
      topic: AUTH_TOPIC,
      cmd: 'load',
      id
    }, (err, user) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(user)
    })
  }

  // COMMANDS
  const create = (req, res, next) => {

    const i = extractInstallation(req, res, next)
    const body = req.body || {}

    const user = opts.extractUser(body)
    const collaboration = Object.assign({}, opts.extractCollaboration(body), collaboration_template)

    const username = user.username
    const password = user.password

    if(!i) return webserverTools.errorReply(next, res, 'installation required')
    if(!username) return webserverTools.errorReply(next, res, 'no username given', 400)
    if(!password) return webserverTools.errorReply(next, res, 'no password given', 400)

    transport.act({
      topic: TOPIC,
      cmd: 'add_user',
      id: i,
      userdata: user,
      collaboration
    }, (err, user) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(201)
        .json(user)
    })
  }

  // TODO: this currently overwrites a user that might have set their details themselves
  const save = (req, res, next) => {
    const id = webserverTools.getIdParam(req, 'id')
    if(!id) return webserverTools.errorReply(next, res, 'id required')
    transport.act({
      topic: AUTH_TOPIC,
      cmd: 'save',
      id,
      data: req.body || {}
    }, (err, users) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(users)
    })
  }

  // TODO: this currently overwrites a user that might have set their details themselves
  const update = (req, res, next) => {
    const id = webserverTools.getIdParam(req, 'id')
    if(!id) return webserverTools.errorReply(next, res, 'id required')
    transport.act({
      topic: AUTH_TOPIC,
      cmd: 'update',
      id,
      data: req.body || {}
    }, (err, users) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(users)
    })
  }

  const del = (req, res, next) => {
    const i = extractInstallation(req, res, next)
    const id = webserverTools.getIdParam(req, 'id')
    if(!i) return webserverTools.errorReply(next, res, 'installation required')
    if(!id) return webserverTools.errorReply(next, res, 'id required')
    transport.act({
      topic: TOPIC,
      cmd: 'delete_user',
      id: i,
      userid: id
    }, (err, users) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(users)
    })
  }

  return {
    list,
    get,
    create,
    save,
    update,
    del
  }
}

module.exports = CollaborationRoutes