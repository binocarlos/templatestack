'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const async = require('async')
const options = require('template-tools/src/utils/options')
const tools = require('../database/tools')

const REQUIRED = [
  'knex'
]

const DEFAULTS = {
  table: 'useraccount',
  usernameField: 'username'
}

/*

  user namespace
  
*/
const StorageSQL = (opts) => {
  
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const knex = opts.knex


  /*
  
    loadById

      * id
    
  */
  const loadById = (req, done) => {
    knex(opts.table)
      .where('id', req.id)
      .asCallback(tools.singleExtractor(done))
  }

  /*
  
    loadByUsername

      * username
    
  */
  const loadByUsername = (req, done) => {
    knex(opts.table)
      .where(opts.usernameField, req.username)
      .asCallback(tools.singleExtractor(done))
  }

  /*
  
    create

      * data
    
  */
  const create = (req, done) => {
    knex
      .insert(req.data)
      .into(opts.table)
      .asCallback(tools.singleExtractor(done))
  }

  /*
  
    save

      * id
      * data
    
  */
  const save = (req, done) => {
    knex(opts.table)
      .where({id: req.id})
      .update(req.data)
      .asCallback(tools.singleExtractor(done))
  }


  /*
  
    update - merges meta data top-level keys

      * id
      * data
    
  */
  const update = (req, done) => {
    loadById({id:req.id}, (err, user) => {
      if(err) return done(err)
      const meta = Object.assign({}, user.meta, req.data)
      update({
        id: req.id,
        data: {meta}
      }, done)
    })
  }

  return {
    loadById,
    loadByUsername,
    create,
    save,
    update
  }
}

module.exports = StorageSQL