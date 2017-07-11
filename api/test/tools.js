"use strict";
const async = require('async')
const Request = require('request')
const request = Request.defaults({jar: true})

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:80/api/v1'

const url = (path) => {
  path = path || ''
  return BASE_URL + path
}

const headers = (existing) => {
  return Object.assign({}, {}, existing)
}

const installationHeaders = (i) => {
  return headers({
    'x-installation-id': i
  })
}

const wrapResult = (done) => (err, res, body) => {
  if(err) return done(err)
  done(null, {
    statusCode: res.statusCode,
    body: body
  })
}

module.exports = {
  request,
  url,
  wrapResult,
  headers
}