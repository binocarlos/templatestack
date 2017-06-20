'use strict'

const HemeraTransport = require('template-api/src/transport/hemera')
const HemeraJoi = require('hemera-joi')
const HemeraSql = require('hemera-sql-store')

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
  return hemera
}

module.exports = Transport