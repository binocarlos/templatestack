'use strict'

const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const RedisSession = require('template-api/src/auth/redis_session')
const Passport = require('template-api/src/auth/passport')
const AuthTools = require('template-api/src/auth/tools')
const WebserverTools = require('template-api/src/webserver/tools')
const InstallationTools = require('template-api/src/installation/tools')

const Routes = require('./routes')
const settings = require('./settings')

const Transport = require('./transport')
const Redis = require('./databases/redis')

const App = () => {

  const app = express()
  const redis = Redis()
  const transport = Transport()

  app.set('view engine', 'ejs')
  
  const session = RedisSession({
    secret: settings.cookie_secret,
    redis
  })
  
  const passport = Passport(transport)
  
  app.use(morgan('tiny'))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(session)
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(AuthTools.middleware())
  app.use(InstallationTools.middleware())
  app.use(WebserverTools.middleware())

  Routes(app, transport, settings)

  app.use(WebserverTools.errorLogger)
  app.use(WebserverTools.errorHandler)

  return app
}

module.exports = App