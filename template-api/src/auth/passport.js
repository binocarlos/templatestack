'use strict'

const async = require('async')
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
  const providers = opts.providers || []

  let strategies = []

  providers.forEach(provider => {
    const strategy = new provider.strategy(provider.opts, (token, refresh_token, profile, done) => {
      async.waterfall([
        (next) => {
          authClient.ensure({
            username: profile.id,
            password: profile.id
          }, next)
        },

        (user, next) => {

          const data = user.meta || {}
          
          data[provider.id] = profile
          data[provider.id + 'Token'] = {
            value: token,
            refresh: refresh_token
          }

          authClient.update({
            id: user.id,
            data
          }, next)
        }
      ], done)
  
    })
    strategies.push({
      provider,
      strategy
    })
    passport.use(provider.id, strategy)
  })

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
  
  passport.strategies = strategies
  return passport
}

module.exports = Passport