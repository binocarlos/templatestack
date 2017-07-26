'use strict'

const HemeraJoi = require('template-api/src/transport/hemera-joi')
const HemeraSql = require('template-api/src/transport/hemera-sql-store')
const SQLAddons = require('template-api/src/transport/hemera-sql-store-addons')

const SystemBackend = require('template-api/src/system/backend')
const AuthBackend = require('template-api/src/auth/backend')
const InstallationBackend = require('template-api/src/installation/backend')
const DiggerBackend = require('template-api/src/digger/backend')
const BookingBackend = require('template-api/src/booking/backend')

const AuthStorage = require('template-api/src/auth/storage_sql')
const InstallationStorage = require('template-api/src/installation/storage_sql')
const DiggerStorage = require('template-api/src/digger/storage_sql')
const BookingStorage = require('template-api/src/booking/storage_sql')

const Hooks = require('./hooks')

const Transport = require('../transport')
const Knex = require('../databases/knex')

const packageJSON = require('../../package.json')

const setupBackends = (hemera, knex) => {
  
  const hooks = Hooks(hemera, knex)

  SystemBackend(hemera, {
    version: packageJSON.version
  })

  AuthStorage(hemera, {
    knex
  })

  InstallationStorage(hemera, {
    knex
  })
  
  AuthBackend(hemera, {
    hooks: hooks.auth
  })

  InstallationBackend(hemera, {
    hooks: hooks.installation
  })

  DiggerBackend(hemera, {
    storage: DiggerStorage(knex, hemera),
    hooks: hooks.digger
  })

  BookingBackend(hemera, {
    storage: BookingStorage(knex, hemera),
    hooks: hooks.booking
  })
}

const Backend = () => {
  
  const transport = Transport()
  const knex = Knex()

  transport.use(HemeraJoi)
  transport.use(HemeraSql, {
    knex: {
      driver: knex
    }
  })

  transport.ready(() => {
    SQLAddons(transport, knex)
    setupBackends(transport, knex)
  })
}

module.exports = Backend