'use strict'

const SystemRoutes = require('template-api/src/system/routes')
const AuthRoutes = require('template-api/src/auth/routes')
const InstallationRoutes = require('template-api/src/installation/routes')
const CollaborationRoutes = require('template-api/src/installation/collaboration_routes')
const DiggerRoutes = require('template-api/src/digger/routes')
const BookingRoutes = require('template-api/src/booking/routes')

const AuthAccess = require('template-api/src/auth/access')
const InstallationAccess = require('template-api/src/installation/access')

const path = require('path')

const settings = require('./settings')

const Routes = (app, clients) => {

  const auth = AuthRoutes({
    client: clients.auth
  })

  const system = SystemRoutes()
  const installation = InstallationRoutes({
    client: clients.installation
  })
  const digger = DiggerRoutes({
    client: clients.digger
  })
  const booking = BookingRoutes({
    client: clients.booking
  })
  const users = CollaborationRoutes({
    client: clients.installation,
    authClient: clients.auth,
    collaboration_template: {
      type: 'user'
    }
  })
  const clients = CollaborationRoutes(transport, {
    client: clients.installation,
    authClient: clients.auth,
    collaboration_template: {
      type: 'client'
    }
  })

  const authAccess = AuthAccess()
  const installationAccess = InstallationAccess({
    client: clients.installation
  })

  const basePath = (path) => settings.base + path
  const iPath = (path) => basePath('/i/:installationid' + path)
  
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

  app.get(iPath('/users'), installationAccess.owner(), users.list)
  app.post(iPath('/users'), installationAccess.owner(), users.create)
  app.get(iPath('/users/:id'), installationAccess.owner(), users.get)
  app.put(iPath('/users/:id'), installationAccess.owner(), users.save)
  app.delete(iPath('/users/:id'), installationAccess.owner(), users.del)

  app.get(iPath('/clients'), installationAccess.viewer(), clients.list)
  app.post(iPath('/clients'), installationAccess.editor(), clients.create)
  app.get(iPath('/clients/:id'), installationAccess.viewer(), clients.get)
  app.put(iPath('/clients/:id'), installationAccess.editor(), clients.save)
  app.delete(iPath('/clients/:id'), installationAccess.editor(), clients.del)

  // resource
  app.get(iPath('/resources'), installationAccess.viewer(), digger.search)
  app.get(iPath('/resources/children'), installationAccess.viewer(), digger.children)
  app.get(iPath('/resources/children/:id'), installationAccess.viewer(), digger.children)
  app.get(iPath('/resources/descendents'), installationAccess.viewer(), digger.descendents)
  app.get(iPath('/resources/descendents/:id'), installationAccess.viewer(), digger.descendents)
  app.get(iPath('/resources/links/:id'), installationAccess.viewer(), digger.links)

  app.post(iPath('/resources'), installationAccess.editor(), digger.create)
  app.post(iPath('/resources/paste'), installationAccess.editor(), digger.paste)
  app.post(iPath('/resources/paste/:id'), installationAccess.editor(), digger.paste)
  app.post(iPath('/resources/swap/:source/:mode/:target'), installationAccess.editor(), digger.swap)

  // these are at the bottom because they could be ambigous
  app.post(iPath('/resources/:id'), installationAccess.editor(), digger.create)
  app.get(iPath('/resources/:id'), installationAccess.viewer(), digger.get)
  app.put(iPath('/resources/:id'), installationAccess.editor(), digger.save)
  app.delete(iPath('/resources/:id'), installationAccess.editor(), digger.delete)

  // booking
  app.get(iPath('/bookings'), installationAccess.viewer(), booking.search)

  app.set('views', path.join(__dirname, 'views'))
}

module.exports = Routes