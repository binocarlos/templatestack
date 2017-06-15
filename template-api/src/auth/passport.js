const processOptions = require('template-tools/src/processOptions')
const passport = require('passport')

const REQUIRED = [
  'loadUser'
]

const Passport = (opts) => {
  opts = processOptions(opts, {
    required: REQUIRED,
    throwError: true
  })

  passport.serializeUser((req, user, done) => {
    const id = opts.extractUserId ?
      opts.extractUserId(user) :
      user.id
    done(null, id)
  })

  passport.deserializeUser((req, id, done) => {
    opts.loadUser(id, done)
  })
    
  return passport
}

module.exports = Passport