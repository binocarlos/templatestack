'use strict'

const Client = require('template-api/src/grpc/client')

const SystemBackend = require('template-api/src/system/backend')

const AuthBackend = require('template-api/src/auth/backend')
const AuthSQLStorage = require('template-api/src/auth/storage_sql')

const InstallationBackend = require('template-api/src/installation/backend')
const InstallationStorage = require('template-api/src/installation/storage_sql')

const DiggerBackend = require('template-api/src/digger/backend')
const DiggerStorage = require('template-api/src/digger/storage_sql')

/*
const BookingBackend = require('template-api/src/booking2/backend')
const MailgunBackend = require('template-api/src/mailgun/backend')
const MailgunTestBackend = require('template-api/src/mailgun/testBackend')
const TwilioBackend = require('template-api/src/twilio/backend')
const TwilioTestBackend = require('template-api/src/twilio/testBackend')
const StripeBackend = require('template-api/src/stripe/backend')
*/

const Knex = require('./databases/knex')
const packageJSON = require('../package.json')

const Backends = () => {

  const knex = Knex()
  
  const system = SystemBackend({
    version: packageJSON.version
  })

  const auth = AuthBackend({
    storage: AuthSQLStorage({knex}),
    hooks: {
      register: (user, done) => done(),
      create: (user, done) => done()
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
  }
}

module.exports = Backends