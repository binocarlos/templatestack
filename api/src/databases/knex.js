'use strict'

const Connection = require('template-api/src/database/knex')
const settings = require('../settings')

const Knex = () => Connection(settings.databases.postgres)
module.exports = Knex