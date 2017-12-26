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
  usernameField: 'username',
  searchFields: [
    'username',
    `meta->'google'->>'displayName'`
  ]
}

const SCRUB_FIELDS = [
  'hashed_password',
  'salt',
]

const scrubUser = (user) => {
  return Object.keys(user || {}).reduce((all, field) => {
    if(SCRUB_FIELDS.indexOf(field) < 0) {
      all[field] = user[field]
    }
    return all
  }, {})
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
  const searchFields = opts.searchFields

  /*
  
    list

      * search
    
  */
  const list = (req, done) => {
    const q = knex
      .select()
      .from(opts.table)

    if(req.search) {
      const sql = searchFields.map(f => `${f} ILIKE ?`).join(' or ')
      const params = searchFields.map(f => `%${req.search}%`)
      q.whereRaw(sql, params)
    }
    
    q.asCallback(tools.allExtractor((err, users) => {
      if(err) return done(err)
      done(null, users.map(scrubUser))
    }))
  }

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
      .returning('*')
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
      .returning('*')
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
      knex(opts.table)
        .where({id: req.id})
        .update({meta})
        .returning('*')
        .asCallback(tools.singleExtractor(done))
    })
  }

  return {
    list,
    loadById,
    loadByUsername,
    create,
    save,
    update
  }
}

module.exports = StorageSQL