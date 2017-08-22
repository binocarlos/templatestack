'use strict'

const options = require('template-tools/src/utils/options')
const passport = require('passport')

const REQUIRED = [
  'authClient'
]

const Passport = (opts) => {
  opts = options.processor(opts, {
    required: REQUIRED
  })

  const authClient = opts.authClient

  passport.serializeUser((req, user, done) => {
    const id = opts.extractUserId ?
      opts.extractUserId(user) :
      user.id
    done(null, id)
  })

  // the backend handler should not expose sensitive data
  passport.deserializeUser((req, id, done) => {
    authClient.load({
      id
    }, done)
  })
    
  return passport
}

module.exports = Passport