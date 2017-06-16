const processOptions = require('template-tools/src/processOptions')
const JsonStrategy = require('passport-json').Strategy

// handles POST json with username/password fields
// passes off to backend for auth and password checking

const REQUIRED = [
  'authenticateUser'
]

// authenticateUser({username, password}, done)

const DEFAULTS = {
  usernameProp: 'username',
  passwordProp: 'password'
}

const PassportJSON = (opts) => {
  opts = processOptions(opts, {
    required: REQUIRED,
    defaults: DEFAULTS,
    throwError: true
  })

  return new JsonStrategy(
    {
      usernameProp: opts.usernameProp,
      passwordProp: opts.passwordProp,
      passReqToCallback: true
    },
    (req, username, password, done) => {
      opts.authenticateUser({username,password}, done)
    }
  )
}

module.exports = PassportJSON