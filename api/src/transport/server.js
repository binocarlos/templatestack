'use strict'

const HemeraJoi = require('hemera-joi')
const HemeraSql = require('hemera-sql-store')
const Hemera = require('./hemera')

const ServerTransport = (settings, databases) => {
  const hemera = Hemera(settings)
  const knex = databases.knex
  hemera.use(HemeraJoi)
  hemera.use(HemeraSql, {
    knex: {
      driver: knex
    }
  })
  return hemera
}

module.exports = ServerTransport