'use strict'

const options = require('../utils/options')
const async = require('async')
const authTools = require('./tools')
const transportTools = require('../transport/tools')

const REQUIRED = [
  'hooks'
]

const REQUIRED_HOOKS = [
  'register',
  'create'
]

const DEFAULTS = {

  topic: 'auth',
  storageTopic: 'auth-storage',

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
    return user
  }
}


const AuthBackend = (hemera, opts) => {
    const Joi = hemera.exposition['hemera-joi'].joi

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const hooks = options.processor(opts.hooks, {
    required: REQUIRED_HOOKS
  })

  const TOPIC = opts.topic
  const STORAGE_TOPIC = opts.storageTopic

  const loadUser = (username, done) => {
    hemera.act({
      topic: STORAGE_TOPIC,
      cmd: 'loadByUsername',
      username: username
    }, done)
  }

  const createUser = (data, done) => {
    data = opts.processNewUser(data)
    hemera.act({
      topic: STORAGE_TOPIC,
      cmd: 'create',
      data
    }, done)
  }

  // refactor the create user code to be re-used in various situations (e.g. register vs user add by admin)
  const createUserController = (subopts = {}) => {
    if(!subopts.cmd) throw new Error('cmd opt required')
    if(!subopts.existsHandler) throw new Error('existsHandler opt required')
    if(!subopts.hook) throw new Error('hook opt required')

    const cmd = subopts.cmd
    const existsHandler = subopts.existsHandler
    const hook = subopts.hook

    hemera.add({
      topic: TOPIC,
      cmd: cmd,
      data: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required()
      })
    }, (req, done) => {

      async.waterfall([
        (next) => loadUser(req.data.username, next),
          
        (user, next) => {
          if(user) {
            return existsHandler(user, done)
          }
          createUser(req.data, next)
        },

        (user, next) => {
          if(user.error) return done(null, user)
          
          hook(user, err => {
            if(err) return next(err)
            next(null, user)
          })
        },

        (user, next) => {

          hemera.act({
            topic: STORAGE_TOPIC,
            cmd: 'loadById',
            id: user.id
          }, next)
        }

      ], (err, user) => {
        if(err) return done(new Error(err))
        done(null, opts.displayUser(user))
      })
    })
  }

  /*
  
    load
    
  */
  transportTools.backend(hemera, {
    inbound: {
      topic: TOPIC,
      cmd: 'load'
    },
    outbound: {
      topic: STORAGE_TOPIC,
      cmd: 'loadById'
    },
    query: {
      id: Joi.number().required()
    },
    map: opts.displayUser
  })

  /*
  
    login
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'login',
    username: Joi.string().required(),
    password: Joi.string().required()

  }, (req, done) => {
    loadUser(req.username, (err, user) => {
      if(err) return done(new Error(err))
      if(!user) return done(null, {
        error: 'incorrect details'
      })
      if(!opts.checkUserPassword(user, req.password)) return done(null, {
        error: 'incorrect details'
      })
      done(null, opts.displayUser(user))
    })
  })

  /*
  
    ensure user - will return user if it exists
    
  */
  createUserController({
    cmd: 'ensure',
    hook: hooks.create,
    existsHandler: (user, done) => done(null, user)
  })

  /*
  
    register
    
  */

  createUserController({
    cmd: 'register',
    hook: hooks.register,
    existsHandler: (user, done) => {
      return done(null, {
        error: user.username + ' already exists'
      })
    }

  })
  


  /*
  
    save
    
  */
  transportTools.backend(hemera, {
    inbound: {
      topic: TOPIC,
      cmd: 'save'
    },
    outbound: {
      topic: STORAGE_TOPIC,
      cmd: 'save'
    },
    query: {
      id: Joi.number().required(),
      data: Joi.object()
    },
    map: opts.displayUser
  })

  /*
  
    update
    
  */
  transportTools.backend(hemera, {
    inbound: {
      topic: TOPIC,
      cmd: 'update'
    },
    outbound: {
      topic: STORAGE_TOPIC,
      cmd: 'update'
    },
    query: {
      id: Joi.number().required(),
      data: Joi.object()
    },
    map: opts.displayUser
  })
}

module.exports = AuthBackend