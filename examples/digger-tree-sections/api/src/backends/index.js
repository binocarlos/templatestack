'use strict'

const Client = require('template-api/src/grpc/client')

const SystemBackend = require('template-api/src/system/backend')

const AuthBackend = require('template-api/src/auth/backend')
const AuthSQLStorage = require('template-api/src/auth/storage_sql')

const InstallationBackend = require('template-api/src/installation/backend')
const InstallationStorage = require('template-api/src/installation/storage_sql')

const DiggerBackend = require('template-api/src/digger/backend')
const DiggerStorage = require('template-api/src/digger/storage_sql')

const DefaultInstallation = require('template-api/src/installation/helpers/defaultInstallation')

const BookingBackend = require('./booking')

const Knex = require('../databases/knex')
const packageJSON = require('../../package.json')

const Backends = (opts = {}) => {

  const knex = Knex()
  const defaultInstallation = DefaultInstallation(opts)
  
  const system = SystemBackend({
    version: packageJSON.version
  })

  const auth = AuthBackend({
    storage: AuthSQLStorage({knex}),
    hooks: {
      register: (user, done) => defaultInstallation.create(user, done),
      create: (user, done) => defaultInstallation.create(user, done),
    },
    removeUserFields: (user) => {
      user = Object.assign({}, user)
      delete((user.meta || {}).googleToken)
      return user
    }
  })

  const installation = InstallationBackend({
    storage: InstallationStorage({knex}),
    hooks: {
      authUpdate: (req, done) => Client('auth', auth).update(req, done),
      authEnsure: (req, done) => Client('auth', auth).ensure(req, done)
    }
  })

  const digger = DiggerBackend({
    storage: DiggerStorage({knex}),
    hooks: {}
  })

  const booking = BookingBackend({
    knex,
    getClients: opts.getClients
  })

  /*
  
    
  const stripe = StripeBackend({
    secretKey: settings.stripe_secret_key
  })

  const mailgun = (!settings.mailgun_api_key || !settings.mailgun_domain) ?
    MailgunTestBackend()
    :
    MailgunBackend({
      apiKey: settings.mailgun_api_key,
      domain: settings.mailgun_domain
    })
  
  const twilio = (!settings.twilio_sid || !settings.twilio_token) ?
    TwilioTestBackend()
    :
    TwilioBackend({
      sid: settings.twilio_sid,
      token: settings.twilio_token
    })
    
  */

  return {
    system,
    auth,
    installation,
    digger,
    booking,
  }
}

module.exports = Backends