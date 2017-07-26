'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const async = require('async')
const options = require('template-tools/src/utils/options')
const tools = require('../database/tools')

const REQUIRED = [
  'knex'
]

const DEFAULTS = {
  topic: 'auth-storage',
  table: 'useraccount',
  usernameField: 'username'
}

/*

  user namespace
  
*/
const StorageSQL = (hemera, opts) => {
  let Joi = hemera.exposition['hemera-joi'].joi

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const knex = opts.knex

  const TOPIC = opts.topic

  /*
  
    loadById
    
  */
  hemera.add({
    topic: TOPIC,
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
    topic: TOPIC,
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
    topic: TOPIC,
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
  
    save
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'save',
    id: Joi.number().required(),
    data: Joi.object().required()
  }, (req, done) => {
    hemera.act({
      topic: 'sql-store-addons',
      cmd: 'update',
      collection: opts.table,
      query: { id: req.id },
      data: req.data
    }, tools.singleExtractor(done))
    
  })

  /*
  
    update - merges meta data top-level keys
    
  */
  hemera.add({
    topic: TOPIC,
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
      if(err) return done(new Error(err))
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

module.exports = StorageSQL