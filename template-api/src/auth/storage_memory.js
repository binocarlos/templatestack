'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const async = require('async')
const options = require('template-tools/src/utils/options')
const tools = require('../database/tools')

const REQUIRED = [
  'loadById',
  'loadByUsername'
]

const DEFAULTS = {
  topic: 'auth-storage'
}

const StorageMemory = (hemera, opts) => {
  let Joi = hemera.exposition['hemera-joi'].joi

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const TOPIC = opts.topic

  /*
  
    loadById
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'loadById',
    id: Joi.number().required()
  }, (req, done) => {
    opts.loadById(req.id, done)
  })

  /*
  
    loadByUsername
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'loadByUsername',
    username: Joi.string().required()
  }, (req, done) => {
    opts.loadByUsername(req.username, done)
  })

  /*
  
    create
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'create',
    data: Joi.object().required()
  }, (req, done) => {
    done('not implemented in memory storage')
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
    done('not implemented in memory storage')
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
    done('not implemented in memory storage')
  })
}

module.exports = StorageMemory