'use strict'

const options = require('template-tools/src/options')
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
  }
}


const AuthBackend = (hemera, opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  hemera.ready(() => {
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
        topic: 'user',
        cmd: 'loadById',
        id: req.id
      }, done)
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
        topic: 'user',
        cmd: 'loadByUsername',
        username: req.username
      }, (err, user) => {
        if(err) return done(err)
        if(!user) return done('incorrect details')
        if(!opts.checkUserPassword(user, req.password)) return done('incorrect details')
        done(null, user)
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
        topic: 'user',
        cmd: 'loadByUsername',
        username: req.data.username
      }, (err, user) => {
        if(err) return next(err)
        if(user) return next(req.username + ' already exists')
        const userData = opts.processNewUser(req.data)

        hemera.act({
          topic: 'user',
          cmd: 'create',
          data: userData
        }, done)

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
        topic: 'user',
        cmd: 'update',
        id: req.id,
        data: req.data
      }, done)


    })
  })
}