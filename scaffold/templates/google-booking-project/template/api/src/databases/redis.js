'use strict'

const Connection = require('template-api/src/database/redis')
const settings = require('../settings')

const Redis = () => Connection(settings.databases.redis)
module.exports = Redis