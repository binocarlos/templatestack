'use strict'

const Redis = require('template-api/src/database/redis')
const Postgres = require('template-api/src/database/postgres')
const Knex = require('template-api/src/database/knex')

const Databases = (settings) => {
  const redisSettings = {
    host: settings.redishost,
    port: settings.redisport
  }
  const postgresSettings = {
    host: settings.postgreshost,
    port: settings.postgresport,
    user: settings.postgresuser,
    password: settings.postgrespassword,
    database: settings.postgresdatabase
  }
  const redis = Redis(redisSettings)
  const postgres = Postgres(postgresSettings)
  const knex = Knex(postgresSettings)
  return {
    redis,
    postgres,
    knex
  }
}

module.exports = Databases