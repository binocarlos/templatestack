'use strict'

const options = require('../utils/options')
const urlparse = require('url').parse
const async = require('async')

const webserverTools = require('../webserver/tools')
const tools = require('./tools')

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
    const id = webserverTools.getIdParam(req, 'id')
    if(!id) return webserverTools.errorReply(next, res, 'installation id required')
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
      topic: 'installation',
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
      topic: 'installation',
      cmd: 'save',
      id,
      data: req.body || {},
      userid: req.userid
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
      topic: 'installation',
      cmd: 'update',
      id,
      data: req.body || {},
      userid: req.userid
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
      topic: 'installation',
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
      topic: 'installation',
      cmd: 'delete',
      id,
      userid: req.userid
    }, (err) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(204)
    })
  }s


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

module.exports = AuthRoutes