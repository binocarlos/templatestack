'use strict'

const options = require('template-tools/src/options')
const ExpressSession = require('express-session')
const RedisStore = require('connect-redis')(ExpressSession)

// use redis to serialize sessions
const REQUIRED = [
  'secret',
  'redis'
]

function RedisSession(opts) {
  opts = options.processor(opts, {
    required: REQUIRED,
    throwError: true
  })
  const store = new RedisStore({
    client: opts.redis,
    prefix: opts.prefix
  })
  return ExpressSession({
    store: store,
    secret: opts.secret,
    resave: false,
    saveUninitialized: false
  })
}

module.exports = RedisSession