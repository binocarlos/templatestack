'use strict'

const options = require('../utils/options')
const urlparse = require('url').parse
const async = require('async')

const webserverTools = require('../webserver/tools')
const tools = require('./tools')

const REQUIRED = [
  
]

const DEFAULTS = {
  topic: 'installation'
}

const InstallationRoutes = (transport, opts) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const TOPIC = opts.topic

  // QUERIES

  const get = (req, res, next) => {
    const id = webserverTools.getIdParam(req, 'id')
    if(!id) return webserverTools.errorReply(next, res, 'installation id required')
    transport.act({
      topic: TOPIC,
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
      topic: TOPIC,
      cmd: 'list',
      userid: req.userid
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
      topic: TOPIC,
      cmd: 'create',
      data: req.body || {},
      userid: req.userid
    }, (err, installation) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(201)
        .json(installation)
    })
  }

  const save = (req, res, next) => {
    const id = webserverTools.getIdParam(req, 'id')
    if(!id) return webserverTools.errorReply(next, res, 'installation id required')
    transport.act({
      topic: TOPIC,
      cmd: 'save',
      id,
      data: req.body || {}
    }, (err, installation) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(201)
        .json(installation)
    })
  }

  const update = (req, res, next) => {
    const id = webserverTools.getIdParam(req, 'id')
    if(!id) return webserverTools.errorReply(next, res, 'installation id required')
    transport.act({
      topic: TOPIC,
      cmd: 'update',
      id,
      data: req.body || {}
    }, (err, installation) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(201)
        .json(installation)
    })
  }

  const activate = (req, res, next) => {
    const id = webserverTools.getIdParam(req, 'id')
    if(!id) return webserverTools.errorReply(next, res, 'installation id required')
    transport.act({
      topic: TOPIC,
      cmd: 'activate',
      id,
      userid: req.userid
    }, (err, user) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(user)
    })
  }

  const del = (req, res, next) => {
    const id = webserverTools.getIdParam(req, 'id')
    if(!id) return webserverTools.errorReply(next, res, 'installation id required')
    transport.act({
      topic: TOPIC,
      cmd: 'delete',
      id
    }, (err) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(204)
        .end()
    })
  }

  return {
    get,
    list,
    create,
    save,
    update,
    activate,
    del
  }
}

module.exports = InstallationRoutes