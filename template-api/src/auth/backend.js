'use strict'

const options = require('../utils/options')
const async = require('async')
const authTools = require('./tools')
const transportTools = require('../transport/tools')
const REQUIRED = [
  
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
    return user
  }
}


const AuthBackend = (hemera, opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const Joi = hemera.exposition['hemera-joi'].joi


  /*
  
    load
    
  */
  transportTools.backend(hemera, {
    inbound: {
      topic: 'auth',
      cmd: 'load'
    },
    outbound: {
      topic: 'user-storage',
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
    topic: 'auth',
    cmd: 'login',
    username: Joi.string().required(),
    password: Joi.string().required()

  }, (req, done) => {

    hemera.act({
      topic: 'user-storage',
      cmd: 'loadByUsername',
      username: req.username
    }, (err, user) => {
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
  
    register
    
  */
  hemera.add({
    topic: 'auth',
    cmd: 'register',
    data: Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required()
    })
  }, (req, done) => {

    async.waterfall([
      (next) => {
        hemera.act({
          topic: 'user-storage',
          cmd: 'loadByUsername',
          username: req.data.username
        }, next)
      },

      (user, next) => {
        if(user) return done(null, {
          error: req.data.username + ' already exists'
        })

        const userData = opts.processNewUser(req.data)

        hemera.act({
          topic: 'user-storage',
          cmd: 'create',
          data: userData
        }, next)
      },

      (user, next) => {
        if(user.error) return done(null, user)

        hemera.act({
          topic: 'hook:auth',
          cmd: 'registered',
          user
        }, (err) => {
          if(err) return next(err)
          next(null, user)
        })
      },

      (user, next) => {

        hemera.act({
          topic: 'user-storage',
          cmd: 'loadById',
          id: user.id
        }, next)
      }

    ], (err, user) => {
      if(err) return done(new Error(err))
      done(null, opts.displayUser(user))
    })
  })


  /*
  
    save
    
  */
  transportTools.backend(hemera, {
    inbound: {
      topic: 'auth',
      cmd: 'save'
    },
    outbound: {
      topic: 'user-storage',
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
      topic: 'auth',
      cmd: 'update'
    },
    outbound: {
      topic: 'user-storage',
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