'use strict'

const SystemRoutes = require('template-api/src/system/routes')
const AuthRoutes = require('template-api/src/auth/routes')
const InstallationRoutes = require('template-api/src/installation/routes')
const CollaborationRoutes = require('template-api/src/installation/collaboration_routes')
const DiggerRoutes = require('template-api/src/digger/routes')

const AuthAccess = require('template-api/src/auth/access')
const InstallationAccess = require('template-api/src/installation/access')

const BookingRoutes = require('./booking')

const settings = require('../settings')

const adminUserIds = settings.admin_users.split(',')
const isUserAdmin = (user) => user && adminUserIds.indexOf(user.username) >= 0
const getUserTags = (user) => {
  let tags = {}
  user = user || {}
  tags.admin = adminUserIds.indexOf(user.username || '') >= 0
  return tags
}

const basePath = (path) => settings.base + path
const iPath = (path) => basePath('/installation/:installationid' + path)

const Routes = (app, rpcClients) => {

  const passport = app.passport
  const auth = AuthRoutes({
    client: rpcClients.auth,
    getUserTags,
    mapUser: (user) => {
      let ret = Object.assign({}, user)
      delete(ret.meta.google._raw)
      delete(ret.meta.google._json)
      return ret
    }
  })

  const system = SystemRoutes({
    client: rpcClients.system
  })

  const installation = InstallationRoutes({
    client: rpcClients.installation
  })

  const collaborators = CollaborationRoutes({
    client: rpcClients.installation,
    authClient: rpcClients.auth,
    collaboration_template: {
      type: 'user'
    }
  })

  const digger = DiggerRoutes({
    client: rpcClients.digger
  })

  const booking = BookingRoutes({
    client: rpcClients.booking
  })

  const authAccess = AuthAccess({
    
  })

  const installationAccess = InstallationAccess({
    client: rpcClients.installation
  })

  const isAdminUser = authAccess.filter(isUserAdmin)

  app.get(basePath('/version'), system.version)

  app.get(basePath('/auth/google'),
    passport.authenticate('google', {
      scope: settings.googleScope,
      prompt: 'consent',
      accessType: 'offline'
    }))

  app.get(basePath('/auth/google/callback'), 
    passport.authenticate('google', { failureRedirect: settings.google_failure_redirect }),
    (req, res) => {
      res.redirect(settings.google_login_redirect)
    })

  app.get(basePath('/auth/status'), auth.status)
  app.post(basePath('/auth/login'), auth.login)
  app.post(basePath('/auth/register'), auth.register)
  app.put(basePath('/auth/update'), authAccess.loggedIn(), auth.update)
  app.put(basePath('/auth/save'), authAccess.loggedIn(), auth.save)
  app.get(basePath('/auth/token'), auth.googleToken)
  app.get(basePath('/auth/refreshtoken'), auth.googleRefreshToken)  
  app.get(basePath('/auth/logout'), auth.logout)

  app.get(basePath('/admin/user'), isAdminUser, auth.list)

  app.get(basePath('/installation'), authAccess.loggedIn(), installation.list)
  app.post(basePath('/installation'), authAccess.loggedIn(), installation.create)
  app.get(basePath('/installation/:id'), installationAccess.viewer('id'), installation.get)
  app.put(basePath('/installation/:id'), installationAccess.editor('id'), installation.save)
  app.delete(basePath('/installation/:id'), installationAccess.editor('id'), installation.del)
  app.put(basePath('/installation/update/:id'), installationAccess.editor('id'), installation.update)
  app.put(basePath('/installation/activate/:id'), installationAccess.viewer('id'), installation.activate)

  app.get(iPath('/collaborators'), installationAccess.owner(), collaborators.list)
  app.post(iPath('/collaborators'), installationAccess.owner(), collaborators.create)
  app.get(iPath('/collaborators/:id'), installationAccess.owner(), collaborators.get)
  app.put(iPath('/collaborators/:id'), installationAccess.owner(), collaborators.save)
  app.delete(iPath('/collaborators/:id'), installationAccess.owner(), collaborators.del)

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

  // admin booking api
  app.get(iPath('/bookings'), installationAccess.viewer(), booking.search)
  app.get(iPath('/bookings/range'), installationAccess.viewer(), booking.range)
  
  /*
  
    
  // config
  app.get(basePath('/config'), config.load)

  // public booking api
  app.get(basePath('/bookings/range'), booking.range)
  app.get(basePath('/bookings/slot/:type/:date/:slot'), bookingSubmit.slot)
  app.post(basePath('/bookings/check'), bookingSubmit.check)
  app.post(basePath('/bookings/submit'), bookingSubmit.submit)

  // admin booking api
  app.get(basePath('/bookings'), authAccess.loggedIn(), booking.search)
  app.post(basePath('/bookings'), authAccess.loggedIn(), bookingSubmit.create)
  app.get(basePath('/bookings/:id'), authAccess.loggedIn(), booking.load)
  app.put(basePath('/bookings/:id'), authAccess.loggedIn(), bookingSubmit.save)
  app.delete(basePath('/bookings/:id'), authAccess.loggedIn(), booking.del)
  app.post(basePath('/bookings/block'), authAccess.loggedIn(), bookingSubmit.block)
  app.post(basePath('/bookings/unblock'), authAccess.loggedIn(), bookingSubmit.unblock)

    
  */
}

module.exports = Routes