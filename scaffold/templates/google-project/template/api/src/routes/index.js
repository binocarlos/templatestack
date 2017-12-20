'use strict'

const SystemRoutes = require('template-api/src/system/routes')
const AuthRoutes = require('template-api/src/auth/routes')

const AuthAccess = require('template-api/src/auth/access')

const UserRoutes = require('./user')

const settings = require('../settings')
const usertools = require('../user')

const Routes = (app, rpcClients) => {

  const passport = app.passport
  const auth = AuthRoutes({
    client: rpcClients.auth,
    getUserTags: usertools.getTags
  })

  const system = SystemRoutes({
    client: rpcClients.system
  })
  
  const user = UserRoutes({
    authClient: rpcClients.auth,
    client: rpcClients.user
  })

  const authAccess = AuthAccess()

  const basePath = (path) => settings.base + path
  
  app.get(basePath('/version'), system.version)

  app.get(basePath('/auth/google'),
    passport.authenticate('google', {
      scope: settings.googleScope,
      prompt: 'consent',
      accessType: 'offline'
    }))

  app.get(basePath('/auth/google/callback'), 
    passport.authenticate('google', { failureRedirect: '/app/login' }),
    (req, res) => {
      res.redirect('/app')
    })

  app.get(basePath('/auth/status'), auth.status)
  app.get(basePath('/auth/logout'), auth.logout)

  app.get(basePath('/admin/user'), user.list)

  app.get(basePath('/auth/token'), user.token)
  app.get(basePath('/auth/refreshtoken'), user.refreshToken)  
}

module.exports = Routes