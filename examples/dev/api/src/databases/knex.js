'use strict'

const Connection = require('template-api/src/database/knex')
const settings = require('../settings')

const Knex = (opts) => Connection(Object.assign({}, settings.databases.postgres, opts))
module.exports = Knex