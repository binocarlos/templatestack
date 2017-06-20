'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const options = require('template-tools/src/options')

const REQUIRED = [
  
]

const DEFAULTS = {
  table: 'useraccount',
  usernameField: 'username'
}

const singleExtractor = (done) => (err, raw) => {
  if(err) return done(err)
  if(!raw) return done(null, null)
  console.log('-------------------------------------------');
console.log('-------------------------------------------');
console.dir(raw)
  if(raw.result) raw = raw.result[0]
  done(null, raw)
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
    }, singleExtractor(done))
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
    }, singleExtractor(done))
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
      topic: 'sql-store',
      cmd: 'create',
      collection: opts.table,
      data: req.data
    }, singleExtractor(done))
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
    }, singleExtractor(done))
  })
}

module.exports = SQLUserStorage