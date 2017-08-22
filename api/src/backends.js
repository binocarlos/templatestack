'use strict'

const SystemBackend = require('template-api/src/system/backend')
const AuthBackend = require('template-api/src/auth/backend')
const InstallationBackend = require('template-api/src/installation/backend')
const DiggerBackend = require('template-api/src/digger/backend')
const BookingBackend = require('template-api/src/booking/backend')

const AuthStorage = require('template-api/src/auth/storage_sql')
const InstallationStorage = require('template-api/src/installation/storage_sql')
const DiggerStorage = require('template-api/src/digger/storage_sql')
const BookingStorage = require('template-api/src/booking/storage_sql')

const Knex = require('./databases/knex')

const packageJSON = require('../package.json')

const Backends = () => {

  const knex = Knex()
  
  const system = SystemBackend({
    version: packageJSON.version
  })

  const auth = AuthBackend({
    storage: AuthStorage({knex}),
    hooks: {
      register: (user, done) => {
        const installationClient = Client(installation)
        installationClient.createDefault({
          userid: user.id
        }, done)
      },
      create: (user, done) => done()
    }
  })

  const installation = InstallationBackend({
    storage: InstallationStorage({knex}),
    hooks: {
      authUpdate: (req, done) => Client(auth).update(req, done),
      authEnsure: (req, done) => Client(auth).ensure(req, done)
    }
  })

  const digger = DiggerBackend({
    storage: DiggerStorage({knex}),
    hooks: {}
  })

  const booking = BookingBackend({
    storage: BookingStorage({knex}),
    hooks: {
      create: (opts, booking, done) => done(),
      save: (opts, booking, done) => done(),
      del: (opts, booking, done) => done()
    }
  })

  return {
    system,
    auth,
    installation,
    digger,
    booking
  }
}

module.exports = Backends