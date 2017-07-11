'use strict'

const options = require('../utils/options')
const urlparse = require('url').parse
const async = require('async')

const webserverTools = require('../webserver/tools')
const tools = require('./tools')

const REQUIRED = [
  'meta'
]

const DEFAULTS = {
  
}

const CollaborationRoutes = (transport, opts) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  // QUERIES
  const list = (req, res, next) => {
    transport.act({
      topic: 'installation',
      cmd: 'list-users',
      meta: opts.meta
    }, (err, users) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(users)
    })
  }

  const create = (req, res, next) => {
    transport.act({
      topic: 'installation',
      cmd: 'list-users',
      meta: opts.meta
    }, (err, users) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(users)
    })
  }

  const save = (req, res, next) => {
    transport.act({
      topic: 'installation',
      cmd: 'list-users',
      meta: opts.meta
    }, (err, users) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(users)
    })
  }

  const update = (req, res, next) => {
    transport.act({
      topic: 'installation',
      cmd: 'list-users',
      meta: opts.meta
    }, (err, users) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(users)
    })
  }

  const delete = (req, res, next) => {
    transport.act({
      topic: 'installation',
      cmd: 'list-users',
      meta: opts.meta
    }, (err, users) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(users)
    })
  }

  return {
    list
  }
}

module.exports = CollaborationRoutes