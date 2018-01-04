'use strict'

const Redis = require('./redis')
const Postgres = require('./postgres')
const Knex = require('./knex')

const Databases = () => {
  
  const redis = Redis()
  const postgres = Postgres()
  const knex = Knex()

  return {
    redis,
    postgres,
    knex
  }
}

module.exports = Databases