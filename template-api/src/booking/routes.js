'use strict'

const options = require('../utils/options')
const urlparse = require('url').parse
const async = require('async')

const webserverTools = require('../webserver/tools')

const REQUIRED = [
  
]

const DEFAULTS = {
  topic: 'booking',
  extractInstallationId: (req) => webserverTools.getIdParam(req, 'installationid')
}

const BookingRoutes = (transport, opts) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const TOPIC = opts.topic

  // QUERIES
  const load = (req, res, next) => {
    const installationid = opts.extractInstallationId(req)
    const id = webserverTools.getIdParam(req, 'id')
    if(!installationid) return webserverTools.errorReply(next, res, 'installationid id required')
    if(!id) return webserverTools.errorReply(next, res, 'booking id required')
    transport.act({
      topic: TOPIC,
      cmd: 'load',
      installationid,
      id
    }, (err, booking) => {
      if(err) return webserverTools.errorReply(next, res, err)
      if(!booking) return webserverTools.errorReply(next, res, 'booking not found', 404)
      res
        .status(200)
        .json(booking)
    })
  }

  const search = (req, res, next) => {
    const installationid = opts.extractInstallationId(req)
    if(!installationid) return webserverTools.errorReply(next, res, 'installationid id required')
    transport.act({
      topic: TOPIC,
      cmd: 'search',
      installationid,
      type: req.qs.type,
      search: req.qs.search,
      from: req.qs.from,
      to: req.qs.to
    }, (err, bookings) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(bookings)
    })
  }

  // COMMANDS
  const create = (req, res, next) => {
    const installationid = opts.extractInstallationId(req)
    if(!installationid) return webserverTools.errorReply(next, res, 'installationid id required')
    const data = req.body
    if(!data) return webserverTools.errorReply(next, res, 'no data given', 400)
    transport.act({
      topic: TOPIC,
      cmd: 'create',
      installationid,
      data
    }, (err, booking) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(201)
        .json(booking)
    })
  }

  const save = (req, res, next) => {
    const installationid = opts.extractInstallationId(req)
    const id = webserverTools.getIdParam(req, 'id')
    if(!installationid) return webserverTools.errorReply(next, res, 'installationid id required')
    if(!id) return webserverTools.errorReply(next, res, 'booking id required')
    const data = req.body
    if(!data) return webserverTools.errorReply(next, res, 'no data given', 400)
    transport.act({
      topic: TOPIC,
      cmd: 'save',
      installationid,
      id,
      data
    }, (err, booking) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(booking)
    })
  }

  const del = (req, res, next) => {
    const installationid = opts.extractInstallationId(req)
    const id = webserverTools.getIdParam(req, 'id')
    if(!installationid) return webserverTools.errorReply(next, res, 'installationid id required')
    if(!id) return webserverTools.errorReply(next, res, 'booking id required')
    transport.act({
      topic: TOPIC,
      cmd: 'del',
      installationid,
      id
    }, (err, booking) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(booking)
    })
  }

  return {
    load,
    search,
    create,
    save,
    del
  }
}

module.exports = BookingRoutes