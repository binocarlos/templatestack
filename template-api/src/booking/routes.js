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

  return {
    search
  }
}

module.exports = BookingRoutes