'use strict'

const HEADER_NAME = 'x-installation-id'

const webserverTools = require('../webserver/tools')

const getHeader = (headers = {}) => headers[HEADER_NAME]

const middleware = () => (req, res, next) => {
  req.installationid = getHeader(req.headers)
  next()
}

const injectInstallation = (id) => (req, res, next) => {
  req.installationid = id
  next()
}

module.exports = {
  headerName: HEADER_NAME,
  getHeader,
  middleware,
  injectInstallation
}