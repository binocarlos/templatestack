'use strict'

const HemeraTransport = require('template-api/src/transport/hemera')
const HemeraJoi = require('template-api/src/transport/hemera-joi')
const HemeraSql = require('template-api/src/transport/hemera-sql-store')
const SQLAddons = require('template-api/src/transport/hemera-sql-store-addons')

const Backend = require('./backend')

const Transport = (settings, databases) => {
  const hemera = HemeraTransport({
    host: settings.natshost,
    port: settings.natsport
  })
  const knex = databases.knex
  hemera.use(HemeraJoi)
  hemera.use(HemeraSql, {
    knex: {
      driver: knex
    }
  })

  hemera.ready(() => {
    SQLAddons(hemera, databases.knex)
    Backend(settings, hemera, databases)
  })

  return hemera
}

module.exports = Transport