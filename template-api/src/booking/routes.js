'use strict'

const options = require('template-tools/src/utils/options')
const urlparse = require('url').parse
const async = require('async')

const webserverTools = require('../webserver/tools')

const REQUIRED = [
  'client'
]

const DEFAULTS = {
  extractInstallationId: (req) => webserverTools.getIdParam(req, 'installationid')
}

const BookingRoutes = (opts) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const client = opts.client

  // QUERIES
  const load = (req, res, next) => {
    const installationid = opts.extractInstallationId(req)
    const id = webserverTools.getIdParam(req, 'id')
    if(!installationid) return webserverTools.errorReply(next, res, 'installationid id required')
    if(!id) return webserverTools.errorReply(next, res, 'booking id required')
    client.load({
      installationid,
      id,
      summary: req.qs.summary == 'y' ? true : false
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
    client.search({
      installationid,
      type: req.qs.type,
      search: req.qs.search,
      start: req.qs.start,
      end: req.qs.end,
      limit: req.qs.limit,
      summary: req.qs.summary == 'y' ? true : false
    }, (err, bookings) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(bookings)
    })
  }

  const range = (req, res, next) => {
    const installationid = opts.extractInstallationId(req)
    if(!installationid) return webserverTools.errorReply(next, res, 'installationid id required')
    client.range({
      installationid,
      type: req.qs.type,
      start: req.qs.start,
      end: req.qs.end,
      summary: req.qs.summary == 'y' ? true : false
    }, (err, results) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(results)
    })
  }

  // COMMANDS
  const create = (req, res, next) => {
    const installationid = opts.extractInstallationId(req)
    if(!installationid) return webserverTools.errorReply(next, res, 'installationid id required')
    const data = req.body
    if(!data) return webserverTools.errorReply(next, res, 'no data given', 400)
    client.create({
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
    client.save({
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
    client.del({
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
    del,
    range
  }
}

module.exports = BookingRoutes