'use strict'

const options = require('template-tools/src/utils/options')
const urlparse = require('url').parse
const async = require('async')

const webserverTools = require('../webserver/tools')

const REQUIRED = [
  'client'
]

const BookingRoutes = (opts) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const client = opts.client

  // QUERIES
  const load = (req, res, next) => {
    if(!req.user) return next('not authorized')
    const userid = req.user.id
    const id = req.params.id
    if(!id) return webserverTools.errorReply(next, res, 'booking id required')
    client.load({
      userid,
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
    if(!req.user) return next('not authorized')
    const userid = req.user.id
    client.search({
      userid,
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
    if(!req.user) return next('not authorized')
    const userid = req.user.id
    client.range({
      userid,
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
    if(!req.user) return next('not authorized')
    const userid = req.user.id
    const data = req.body
    if(!data) return webserverTools.errorReply(next, res, 'no data given', 400)
    client.create({
      userid,
      data
    }, (err, booking) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(201)
        .json(booking)
    })
  }

  const save = (req, res, next) => {
    if(!req.user) return next('not authorized')
    const userid = req.user.id
    const id = webserverTools.getIdParam(req, 'id')
    if(!id) return webserverTools.errorReply(next, res, 'booking id required')
    const data = req.body
    if(!data) return webserverTools.errorReply(next, res, 'no data given', 400)
    client.save({
      userid,
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
    if(!req.user) return next('not authorized')
    const userid = req.user.id    
    const id = webserverTools.getIdParam(req, 'id')
    if(!id) return webserverTools.errorReply(next, res, 'booking id required')
    client.del({
      userid,
      id
    }, (err, booking) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(booking)
    })
  }


  const check = (req, res, next) => {
    const userid = req.installationid
    const data = req.body
    
    client.check({
      installationid,
      data
    }, (err, result) => {
      if(err || !result.ok) {
        res
          .status(400)
          .json({
            ok: false,
            error: err ? err.toString() : result.error
          })
      }
      else {
        res
          .status(200)
          .json({
            ok: result.ok,
            slot: result.slot
          })  
      }
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