'use strict'

const Connection = require('template-api/src/database/postgres')
const settings = require('../settings')

const Postgres = () => Connection(settings.databases.postgres.connection)
module.exports = Postgres