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
  
}

const StorageMemory = (opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const TOPIC = opts.topic

  /*
  
    loadById

      * id
    
  */
  const loadById = (req, done) => opts.loadById(req.id, done)

  /*
  
    loadByUsername

      * username
    
  */
  const loadByUsername = (req, done) => opts.loadByUsername(req.username, done)

  /*
  
    create

      * data
    
  */
  const create = (req, done) => done('not implemented in memory storage')
  
  /*
  
    save

      * id
      * data
    
  */
  const save = (req, done) => done('not implemented in memory storage')
  
  /*
  
    update - merges meta data top-level keys

      * id
      * data
    
  */
  const update = (req, done) => done('not implemented in memory storage')

  return {
    loadById,
    loadByUsername,
    create,
    save,
    update
  }
}

module.exports = StorageMemory