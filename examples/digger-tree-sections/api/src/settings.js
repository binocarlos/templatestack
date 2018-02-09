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
    cookie_secret: process.env.COOKIE_SECRET,
    frontend_proxy: process.env.FRONTEND_PROXY || 'frontend',
    app_url: process.env.APP_URL,
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    admin_users: process.env.ADMIN_USERS || '',
    google_login_redirect: process.env.GOOGLE_LOGIN_REDIRECT || '/',
    google_failure_redirect: process.env.GOOGLE_FAILURE_REDIRECT || '/',
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

args.googleScope = [
  'https://www.googleapis.com/auth/userinfo.profile'
]

args.databases = databases

module.exports = args