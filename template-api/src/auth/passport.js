'use strict'

const options = require('template-tools/src/utils/options')
const passport = require('passport')

const REQUIRED = [

]

const Passport = (transport, opts) => {
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
    }, (err, user) => {
      done(null, user)
    })
  })
    
  return passport
}

module.exports = Passport