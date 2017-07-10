'use strict'

const options = require('../utils/options')
const async = require('async')
const authTools = require('./tools')

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
  hemera.add({
    topic: 'auth',
    cmd: 'load',
    id: Joi.number().required()
  }, (req, done) => {

    hemera.act({
      topic: 'user-storage',
      cmd: 'loadById',
      id: req.id
    }, (err, user) => {
      if(err) return done(err)
      done(null, opts.displayUser(user))
    })
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

    hemera.act({
      topic: 'user-storage',
      cmd: 'loadByUsername',
      username: req.data.username
    }, (err, user) => {

      if(err) return done(new Error(err))
      if(user) return done(null, {
        error: req.username + ' already exists'
      })

      const userData = opts.processNewUser(req.data)

      hemera.act({
        topic: 'user-storage',
        cmd: 'create',
        data: userData
      }, (err, user) => {
        if(err) return done(err)
        done(null, opts.displayUser(user))
      })

    })
  })

  /*
  
    update
    
  */
  hemera.add({
    topic: 'auth',
    cmd: 'update',
    id: Joi.number().required(),
    data: Joi.object()
  }, (req, done) => {

    hemera.act({
      topic: 'user-storage',
      cmd: 'update',
      id: req.id,
      data: req.data
    }, (err, user) => {
      if(err) return done(err)
      done(null, opts.displayUser(user))
    })

  })
}

module.exports = AuthBackend