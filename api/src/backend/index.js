'use strict'

const Auth = require('./auth')
const HemeraJoi = require('hemera-joi')
const HemeraSql = require('hemera-sql-store')

const SQLUserStorage = require('template-api/src/auth/sql_storage')

const Backend = (settings, databases, transportFactory) => {
  const hemera = transportFactory()
  const knex = databases.knex
  hemera.use(HemeraJoi)
  hemera.use(HemeraSql, {
    knex: {
      driver: knex
    }
  })

  SQLUserStorage(hemera)
  Auth(hemera, databases)
}

module.exports = Backend