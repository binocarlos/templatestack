'use strict'

const refresh = require('passport-oauth2-refresh')
const options = require('template-tools/src/utils/options')
const async = require('async')
const authTools = require('./tools')

const REQUIRED = [
  'hooks',
  'storage'
]

const REQUIRED_HOOKS = [
  'register',
  'create'
]

const REQUIRE_STORAGE_METHODS = [
  'loadById',
  'loadByUsername',
  'create',
  'save',
  'update'
]

const DEFAULTS = {
  checkUserPassword: (user, check_password) => {
    const salt = user.salt
    const password = user.hashed_password
    return authTools.encryptPassword(check_password, salt) == password
  },

  processNewUser: (user) => {
    user = Object.assign({}, user)
    const password = user.password
    delete(user.password)
    user.salt = authTools.makeSalt()
    user.hashed_password = authTools.encryptPassword(password, user.salt)
    return user
  },

  displayUser: (user) => {
    user = Object.assign({}, user)
    delete(user.salt)
    delete(user.hashed_password)
    delete(user.created_at)
    return user
  },

  removeUserFields: (user) => user,
}

const AuthBackend = (opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  options.processor(opts.storage, {
    required: REQUIRE_STORAGE_METHODS
  })

  const hooks = options.processor(opts.hooks, {
    required: REQUIRED_HOOKS
  })

  const storage = opts.storage

  const createUser = (data, done) => {
    data = opts.processNewUser(data)
    storage.create({data}, done)
  }

  // refactor the create user code to be re-used in various situations (e.g. register vs user add by admin)
  const createUserController = (subopts = {}) => {
    if(!subopts.existsHandler) throw new Error('existsHandler opt required')
    if(!subopts.hook) throw new Error('hook opt required')

    const existsHandler = subopts.existsHandler
    const hook = subopts.hook

    // * username
    // * password
    const handler = (call, done) => {

      async.waterfall([
        (next) => storage.loadByUsername({username:call.request.username}, next),
          
        (user, next) => {
          if(user) {
            return existsHandler(user, done)
          }
          createUser(call.request, next)
        },

        (user, next) => {
          if(user.error) return done(null, user)
          
          hook(user, err => {
            if(err) return next(err)
            next(null, user)
          })
        },

        (user, next) => {
          storage.loadById({
            id: user.id
          }, next)
        }

      ], (err, user) => {
        if(err) return done(err)
        done(null, opts.displayUser(user))
      })
    }

    return handler
  }

  /*
  
    load

      * id
    
  */
  const load = (call, done) => {
    storage.loadById({
      id: call.request.id
    }, (err, user) => {
      if(err) return done(err)
      done(null, opts.displayUser(user))
    })
  }

  /*
  
    list

      * search
    
  */
  const list = (call, done) => {
    storage.list({
      search: call.request.search
    }, (err, users) => {
      if(err) return done(err)
      done(null, users)
    })
  }

  /*
  
    login

      * username
      * password
    
  */
  const login = (call, done) => {
    storage.loadByUsername({
      username: call.request.username
    }, (err, user) => {
      if(err) return done(err)
      if(!user) return done(null, {
        error: 'incorrect details'
      })
      if(!opts.checkUserPassword(user, call.request.password)) return done(null, {
        error: 'incorrect details'
      })
      done(null, opts.displayUser(user))
    })
  }

  /*
  
    ensure user - will return user if it exists

      * username
      * password
    
  */

  const ensure = createUserController({
    hook: hooks.create,
    existsHandler: (user, done) => done(null, user)
  })

  /*
  
    register

      * username
      * password
    
  */
  const register = createUserController({
    hook: hooks.register,
    existsHandler: (user, done) => {
      return done(null, {
        error: user.username + ' already exists'
      })
    }
  })

  /*
  
    save

      * id
      * data
    
  */
  const save = (call, done) => {
    storage.save(call.request, (err, user) => {
      if(err) return done(err)
      done(null, opts.displayUser(user))
    })
  }

  /*
  
    update

      * id
      * data
    
  */
  const update = (call, done) => {
    storage.update(call.request, (err, user) => {
      if(err) return done(err)
      done(null, opts.displayUser(user))
    })
  }


  /*
  
    googleToken

      * id
    
  */
  const googleToken = (call, done) => {
    async.waterfall([
      (next) => load(call, next),
      (user, next) => {
        const token = (user.meta || {}).googleToken || {}
        next(null, token.value || '')
      }
    ], done)
  }

  /*
  
    googleRefreshToken

      * id
    
  */
  const googleRefreshToken = (call, done) => {
    async.waterfall([
      (next) => load(call, next),
      (user, next) => {
        const token = (user.meta || {}).googleToken || {}
        const refreshToken = token.refresh || token.secret
        refresh.requestNewAccessToken('google', refreshToken, (err, accessToken) => {
          if(err) return done(err)
          user.meta.googleToken = {
            value: accessToken,
            refresh: refreshToken
          }
          authClient.update({
            id: user.id,
            data: user.meta
          }, (err) => {
            if(err) return next(err)
            next(null, accessToken)
          })
        })
      }
    ], done)
  }

  return {
    load,
    list,
    login,
    ensure,
    register,
    save,
    update,
    googleToken,
    googleRefreshToken
  }
}

module.exports = AuthBackend