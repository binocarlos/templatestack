'use strict'

const options = require('template-tools/src/options')
const passport = require('passport')

const REQUIRED = [
  'loadUser:function'
]

// loadUser(id, done)
// extractUserId(user)

const Passport = (transports, opts) => {
  opts = options.processor(opts, {
    required: REQUIRED
  })

  passport.serializeUser((req, user, done) => {
    const id = opts.extractUserId ?
      opts.extractUserId(user) :
      user.id
    done(null, id)
  })

  // the backend handler should not expose sensitive data
  passport.deserializeUser((req, id, done) => {
    transport.act({
      topic: 'auth',
      cmd: 'load',
      id
    }, done)
  })
    
  return passport
}

module.exports = Passport