'use strict'

const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const refresh = require('passport-oauth2-refresh')

const RedisSession = require('template-api/src/auth/redis_session')
const Passport = require('template-api/src/auth/passport')
const AuthTools = require('template-api/src/auth/tools')
const WebserverTools = require('template-api/src/webserver/tools')
const InstallationTools = require('template-api/src/installation/tools')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

const Routes = require('./routes')
const settings = require('./settings')

const Redis = require('./databases/redis')

const WEB_ROOT = '/wwwdata'

const App = (opts = {}) => {
  const clients = opts.clients
  if(!clients) throw new Error('clients needed for app')

  const app = express()
  const redis = Redis()

  app.set('view engine', 'ejs')
  
  const session = RedisSession({
    secret: settings.cookie_secret,
    redis
  })
  
  const passport = Passport({
    authClient: clients.auth,
    providers: [{
      id: 'google',
      strategy: GoogleStrategy,
      opts: {
        clientID: settings.google_client_id,
        clientSecret: settings.google_client_secret,
        callbackURL: `${settings.app_url}/api/v1/auth/google/callback`
      }
    }]
  })

  passport.strategies.forEach(s => {
    refresh.use(s.strategy)
  })

  app.passport = passport

  app.use(morgan('tiny'))

  if(fs.existsSync(WEB_ROOT)) {
    app.use(ecstatic({
      root: WEB_ROOT, 
      handleError: false
    }))
  }

  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(session)
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(AuthTools.middleware())
  app.use(InstallationTools.middleware())
  app.use(WebserverTools.middleware())

  Routes(app, clients, settings)

  app.use(WebserverTools.errorLogger)
  app.use(WebserverTools.errorHandler)

  app.set('views', path.join(__dirname, 'views'))

  return app
}

module.exports = App