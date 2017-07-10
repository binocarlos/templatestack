'use strict'

const Redis = require('template-api/src/database/redis')
const Postgres = require('template-api/src/database/postgres')
const Knex = require('template-api/src/database/knex')

const settings = require('./settings')

const Databases = () => {
  
  const redis = Redis(settings.databases.redis)
  const postgres = Postgres(settings.databases.postgres.connection)
  const knex = Knex(settings.databases.postgres)
  return {
    redis,
    postgres,
    knex
  }
}

module.exports = Databases