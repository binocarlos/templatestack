'use strict'

const SystemRoutes = require('template-api/src/system/routes')
const AuthRoutes = require('template-api/src/auth/routes')
const InstallationRoutes = require('template-api/src/installation/routes')
const CollaborationRoutes = require('template-api/src/installation/collaboration_routes')

const AuthAccess = require('template-api/src/auth/access')
const InstallationAccess = require('template-api/src/installation/access')

const path = require('path')

const settings = require('./settings')

const Routes = (app, transport) => {
  const auth = AuthRoutes(transport)
  const system = SystemRoutes(transport)
  const installation = InstallationRoutes(transport)

  const users = CollaborationRoutes(transport, {
    collaboration_template: {
      type: 'user'
    }
  })
  const clients = CollaborationRoutes(transport, {
    collaboration_template: {
      type: 'client'
    }
  })

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
  app.get(basePath('/installation/:id'), installationAccess.viewer('id'), installation.get)
  app.put(basePath('/installation/:id'), installationAccess.editor('id'), installation.save)
  app.delete(basePath('/installation/:id'), installationAccess.editor('id'), installation.del)
  app.put(basePath('/installation/update/:id'), installationAccess.editor('id'), installation.update)
  app.put(basePath('/installation/activate/:id'), installationAccess.viewer('id'), installation.activate)

  app.get(basePath('/i/:installationid/users'), installationAccess.owner(), users.list)
  app.post(basePath('/i/:installationid/users'), installationAccess.owner(), users.create)
  app.get(basePath('/i/:installationid/users/:id'), installationAccess.owner(), users.get)
  app.put(basePath('/i/:installationid/users/:id'), installationAccess.owner(), users.save)
  app.delete(basePath('/i/:installationid/users/:id'), installationAccess.owner(), users.del)

  app.get(basePath('/i/:installationid/clients'), installationAccess.viewer(), clients.list)
  app.post(basePath('/i/:installationid/clients'), installationAccess.editor(), clients.create)
  app.get(basePath('/i/:installationid/clients/:id'), installationAccess.viewer(), clients.get)
  app.put(basePath('/i/:installationid/clients/:id'), installationAccess.editor(), clients.save)
  app.delete(basePath('/i/:installationid/clients/:id'), installationAccess.editor(), clients.del)

  app.set('views', path.join(__dirname, 'views'))
}

module.exports = Routes