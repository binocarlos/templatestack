'use strict'

const urlparse = require('url').parse
const express = require('express')
const httpProxy = require('http-proxy')

const getQueryString = (req) => urlparse(req.url, true).query
const staticServer = (dir) => express.static(dir)
const proxyServer = (backend) => {
  const proxy = httpProxy.createProxyServer()
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

const clientErrorHandler = (err, req, res, next) => {
  if (req.xhr) {
    jsonError(res, err)
  } else {
    next(err)
  }
}

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  if(req.headers['accept'] == 'application/json') {
    jsonError(res, err)
  }
  else {
    htmlError(res, err)
  }
}

const errorReply = (next, res, err, code) => {
  res._code = code
  next(err)
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
  errorReply
}