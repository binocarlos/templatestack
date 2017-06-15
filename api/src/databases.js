const Redis = require('template-api/src/database/redis')
const Postgres = require('template-api/src/database/postgres')

const Databases = (settings) => {
  const redis = Redis({
    host: settings.redishost,
    port: settings.redisport
  })
  const postgres = Postgres({
    host: settings.postgreshost,
    port: settings.postgresport,
    user: settings.postgresuser,
    password: settings.postgrespassword,
    database: settings.postgresdatabase
  })

  return {
    redis,
    postgres
  }
}

module.exports = Databases