'use strict'

const HemeraJoi = require('hemera-joi')
const HemeraSql = require('hemera-sql-store')

const HemeraTransport = require('template-api/src/transport/hemera')

const Transports = (settings, databases) => () => {

  const hemera = () => {
    return HemeraTransport({
      host: settings.natshost,
      port: settings.natsport
    })
  }

  const client = () => hemera()

  const server = () => {
    const base = hemera()
    const knex = databases.knex
    base.use(HemeraJoi)
    base.use(HemeraSql, {
      knex: {
        driver: knex
      }
    })
    return base
  }

  return {
    client,
    server
  }
}

module.exports = Transports