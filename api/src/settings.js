'use strict'

const args = require('minimist')(process.argv, {
  default:{
    port: process.env.PORT || 80,
    base: process.env.BASE || '/api/v1',
    postgreshost: process.env.POSTGRES_SERVICE_HOST || 'postgres',
    postgresport: process.env.POSTGRES_SERVICE_PORT,
    postgresuser: process.env.POSTGRES_SERVICE_USER,
    postgrespassword: process.env.POSTGRES_SERVICE_PASSWORD,
    postgresdatabase: process.env.POSTGRES_SERVICE_DATABASE,
    redishost: process.env.REDIS_SERVICE_HOST || 'redis',
    redisport: process.env.REDIS_SERVICE_PORT,
    natshost: process.env.NATS_SERVICE_HOST || 'nats',
    natsport: process.env.NATS_SERVICE_PORT,
    cookie_secret: process.env.COOKIE_SECRET,
    // this is production and we are serving the build
    frontend_www: process.env.FRONTEND_WWW,
    // this is development and we are proxying back to webpack-hot-reload thingy
    frontend_proxy: process.env.FRONTEND_PROXY
  }
})

module.exports = args