'use strict'

const options = require('template-tools/src/options')

const REQUIRED = [
  
]

const DEFAULTS = {
  table: 'user'
}


/*

  user namespace
  
*/
const SQLUserStorage = (hemera, opts) => {
  opts = options.process(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  hemera.ready(() => {
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
      }, done)
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
        cmd: 'findById',
        collection: opts.table,
        query: {
          username: req.username
        }
      }, done)
    })
  })
}