'use strict'

const args = require('minimist')(process.argv, {
  default:{
    backend: process.env.BACKEND || 'yes',
    webserver: process.env.WEBSERVER || 'yes',
    port: process.env.PORT || 80,
    base: process.env.BASE || '/api/v1',
    postgreshost: process.env.POSTGRES_SERVICE_HOST || 'postgres',
    postgresport: process.env.POSTGRES_SERVICE_PORT,
    postgresuser: process.env.POSTGRES_USER,
    postgrespassword: process.env.POSTGRES_PASSWORD,
    postgresdatabase: process.env.POSTGRES_DB,
    redishost: process.env.REDIS_SERVICE_HOST || 'redis',
    redisport: process.env.REDIS_SERVICE_PORT,
    natshost: process.env.NATS_SERVICE_HOST || 'nats',
    natsport: process.env.NATS_SERVICE_PORT,
    cookie_secret: process.env.COOKIE_SECRET,
    frontend_proxy: process.env.FRONTEND_PROXY || 'frontend'
  }
})

const databases = {
  redis: {
    host: args.redishost,
    port: args.redisport
  },
  postgres: {
    client: 'pg',
    connection: {
      host: args.postgreshost,
      port: args.postgresport,
      user: args.postgresuser,
      password: args.postgrespassword,
      database: args.postgresdatabase
    },
    pool: {
      min: 2,
      max: 10
    }
  }
}

args.databases = databases

module.exports = args