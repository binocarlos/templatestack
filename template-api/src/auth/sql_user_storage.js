'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const async = require('async')
const options = require('../utils/options')
const tools = require('./tools')
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
    topic: 'user',
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
    topic: 'user',
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
    topic: 'user',
    cmd: 'create',
    data: Joi.object().required()
  }, (req, done) => {
    hemera.act({
      topic: 'sql-store-addons',
      cmd: 'create',
      collection: opts.table,
      data: req.data
    }, (err, res) => {
      console.log('-------------------------------------------');
      console.dir(err)
      console.dir(res)
      process.exit()
    })
  })

  /*
  
    update
    
  */
  hemera.add({
    topic: 'user',
    cmd: 'update',
    id: Joi.number().required(),
    data: Joi.object().required()
  }, (req, done) => {
    hemera.act({
      topic: 'sql-store',
      cmd: 'updateById',
      collection: opts.table,
      id: req.id,
      data: req.data
    }, tools.singleExtractor(done))
  })
}

module.exports = SQLUserStorage