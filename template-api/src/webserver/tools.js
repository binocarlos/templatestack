'use strict'

const urlparse = require('url').parse
const express = require('express')
const httpProxy = require('http-proxy')

const getQueryString = (req) => urlparse(req.url, true).query
const staticServer = (dir) => express.static(dir)
const proxyServer = (backend) => {
  const proxy = httpProxy.createProxyServer()
  proxy.on('error', function(e) {
    console.error('Could not connect to proxy, please try again...');
  });
  return (req, res) => {
    proxy.web(req, res, {
      target: `http://${backend}`
    })
  }
}


const jsonError = (res, err) => {
  const code = res._code || 500
  res.status(code)
  res.json({ error: err.toString() })
}

const htmlError = (res, err) => {
  const code = res._code || 500
  res.status(code)
  res.render('error', { error: err.toString() })
}


const errorLogger = (err, req, res, next) => {
  console.error(err.stack)
  next(err)
}

const isXHR = (req) => {
  return req.xhr || ((req.headers['accept'] || '').indexOf('application/json') >= 0)
}

const clientErrorHandler = (err, req, res, next) => {
  if (isXHR(req)) {
    jsonError(res, err)
  } else {
    next(err)
  }
}

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  
  if (isXHR(req)) {
    jsonError(res, err)
  } else {
    htmlError(res, err)
  }
}

const errorReply = (next, res, err, code) => {
  res._code = code
  console.error(`${code} - ${err}`)
  next(err)
}

const isJSON = (req) => req.xhr || req.headers['accept'] == 'application/json'

// extract a numeric named path parameter from the route (e.g. /:id)
const getIdParam = (req, name) => {
  name = name || 'id'
  const val = parseInt(req.params[name])
  return isNaN(val) ? null : val
}

const middleware = () => (req, res, next) => {
  req.qs = urlparse(req.url, true).query
  next()
}

module.exports = {
  getQueryString,
  staticServer,
  proxyServer,
  errorLogger,
  jsonError,
  htmlError,
  clientErrorHandler,
  errorHandler,
  errorReply,
  isJSON,
  getIdParam,
  middleware
}