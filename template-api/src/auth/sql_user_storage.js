'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const async = require('async')
const options = require('../utils/options')
const tools = require('../database/tools')

const REQUIRED = [
  
]

const DEFAULTS = {
  table: 'useraccount',
  usernameField: 'username'
}

/*

  user namespace
  
*/
const SQLUserStorage = (hemera, opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  let Joi = hemera.exposition['hemera-joi'].joi

  /*
  
    loadById
    
  */
  hemera.add({
    topic: 'user-storage',
    cmd: 'loadById',
    id: Joi.number().required()
  }, (req, done) => {
    hemera.act({
      topic: 'sql-store',
      cmd: 'findById',
      collection: opts.table,
      id: req.id
    }, tools.singleExtractor(done))
  })

  /*
  
    loadByUsername
    
  */
  hemera.add({
    topic: 'user-storage',
    cmd: 'loadByUsername',
    username: Joi.string().required()
  }, (req, done) => {
    hemera.act({
      topic: 'sql-store',
      cmd: 'find',
      collection: opts.table,
      query: {
        [opts.usernameField]: req.username
      },
      options: {}
    }, tools.singleExtractor(done))
  })

  /*
  
    create
    
  */
  hemera.add({
    topic: 'user-storage',
    cmd: 'create',
    data: Joi.object().required()
  }, (req, done) => {
    hemera.act({
      topic: 'sql-store-addons',
      cmd: 'create',
      collection: opts.table,
      data: req.data
    }, tools.singleExtractor(done))
  })

  /*
  
    update
    
  */
  hemera.add({
    topic: 'user-storage',
    cmd: 'update',
    id: Joi.number().required(),
    data: Joi.object().required()
  }, (req, done) => {
    hemera.act({
      topic: 'sql-store',
      cmd: 'findById',
      collection: opts.table,
      id: req.id
    }, tools.singleExtractor((err, user) => {
      if(err) return done(err)
      const meta = Object.assign({}, user.meta, req.data)
      hemera.act({
        topic: 'sql-store-addons',
        cmd: 'update',
        collection: opts.table,
        query: { id: req.id },
        data: { meta }
      }, tools.singleExtractor(done))
    }))
    
  })
}

module.exports = SQLUserStorage