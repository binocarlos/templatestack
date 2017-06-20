'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const RedisSession = require('template-api/src/auth/redis_session')
const Passport = require('template-api/src/auth/passport')
const WebserverTools = require('template-api/src/webserver/tools')

const Routes = require('./routes')

const App = (settings, databases, transport) => {

  const app = express()

  app.set('view engine', 'ejs')
  
  const session = RedisSession({
    secret: settings.cookie_secret,
    redis: databases.redis
  })
  
  const passport = Passport(transport)
  
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(session)
  app.use(passport.initialize())
  app.use(passport.session())

  Routes(app, transport, settings)

  if(settings.frontend_www) {
    app.use(WebserverTools.staticServer(settings.frontend_www))
  }

  if(settings.frontend_proxy) {
    app.use(WebserverTools.proxyServer(settings.frontend_proxy))
  }

  app.use(WebserverTools.errorLogger)
  app.use(WebserverTools.clientErrorHandler)
  app.use(WebserverTools.errorHandler)

  return app
}

module.exports = App