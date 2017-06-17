'use strict'

const options = require('template-tools/src/options')

const REQUIRED = [
  
]

const DEFAULTS = {
  
}


const AuthBackend = (hemera, opts) => {
  opts = options.process(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  hemera.ready(() => {
    let Joi = hemera.exposition['hemera-joi'].joi

    /*
    
      load user
      
    */
    hemera.add({
      topic: 'auth',
      cmd: 'load',
      id: Joi.number().required()
    }, (req, done) => {
      hemera.act({
        topic: 'user',
        cmd: 'loadById'
        id: req.id
      }, done)
    })

    /*
    
      login user
      
    */
    hemera.add({
      topic: 'auth',
      cmd: 'login',
      username: Joi.string().required(),
      password: Joi.string().required()
    }, (req, done) => {
      hemera.act({
        topic: 'user',
        cmd: 'loadByUsername'
        username: req.username
      }, (err, user) => {
        if(err) return done(err)
        if(!user) return done('incorrect details')
        
      })
    })
  })
}