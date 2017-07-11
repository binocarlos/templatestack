'use strict'

const SystemRoutes = require('template-api/src/system/routes')
const AuthRoutes = require('template-api/src/auth/routes')
const InstallationRoutes = require('template-api/src/installation/routes')

const AuthAccess = require('template-api/src/auth/access')
const InstallationAccess = require('template-api/src/installation/access')

const path = require('path')

const settings = require('./settings')

const Routes = (app, transport) => {
  const auth = AuthRoutes(transport)
  const system = SystemRoutes(transport)
  const installation = InstallationRoutes(transport)

  const authAccess = AuthAccess(transport)
  const installationAccess = InstallationAccess(transport)

  const basePath = (path) => settings.base + path
  
  app.get(basePath('/version'), system.version)

  app.get(basePath('/auth/status'), auth.status)
  app.post(basePath('/auth/login'), auth.login)
  app.post(basePath('/auth/register'), auth.register)
  app.put(basePath('/auth/update'), authAccess.loggedIn(), auth.update)
  app.put(basePath('/auth/save'), authAccess.loggedIn(), auth.save)
  app.get(basePath('/auth/logout'), auth.logout)

  app.get(basePath('/installation'), authAccess.loggedIn(), installation.list)
  app.post(basePath('/installation'), authAccess.loggedIn(), installation.create)
  app.get(basePath('/installation/:id'), authAccess.loggedIn(), installationAccess.viewer(), installation.get)
  app.put(basePath('/installation/:id'), authAccess.loggedIn(), installationAccess.editor(), installation.save)
  app.del(basePath('/installation/:id'), authAccess.loggedIn(), installationAccess.editor(), installation.del)
  app.put(basePath('/installation/update/:id'), authAccess.loggedIn(), installationAccess.editor(), installation.update)
  app.put(basePath('/installation/activate/:id'), authAccess.loggedIn(), installationAccess.viewer(), installation.activate)

  app.set('views', path.join(__dirname, 'views'))
}

module.exports = Routes