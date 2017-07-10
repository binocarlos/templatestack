'use strict'

const InstallationMiddleware = (opts = {}) => (req, res, next) => {
  req.installationid = req.headers['x-installation-id']
  next()
}

module.exports = InstallationMiddleware