'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const async = require('async')
const options = require('../utils/options')
const tools = require('../database/tools')

const REQUIRED = [
  'knex'
]

const DEFAULTS = {
  installationTable: 'installation',
  collaborationTable: 'collaboration',
  userTablename: 'useraccount'
}

/*

  user namespace
  
*/
const InstallationStorageSQL = (hemera, opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const tables = {
    installation: opts.installationTable,
    collaboration: opts.collaborationTable,
    user: opts.userTablename
  }

  const knex = opts.knex

  let Joi = hemera.exposition['hemera-joi'].joi

  /*
  
    loadById
    
  */
  hemera.add({
    topic: 'installation-storage',
    cmd: 'loadById',
    id: Joi.number().required()
  }, (req, done) => {
    hemera.act({
      topic: 'sql-store',
      cmd: 'findById',
      collection: tables.installation,
      id: req.id
    }, tools.singleExtractor(done))
  })

  /*
  
    list
    
  */
  hemera.add({
    topic: 'installation-storage',
    cmd: 'list',
    userid: Joi.number().required()
  }, (req, done) => {

    knex
      .select(`${tables.installation}.*`)
      .from(tables.installation)
      .innerJoin(
        tables.collaboration,
        `${tables.installation}.id`,
        `${tables.collaboration}.id`
      )
      .where({
        [`${tables.collaboration}.${tables.user}`]: req.userid
      })
      .asCallback(tools.allExtractor(done))

  })

  /*
  
    loadCollaboration
    
  */
  hemera.add({
    topic: 'installation-storage',
    cmd: 'loadCollaboration',
    id: Joi.number().required(),
    userid: Joi.number().required()
  }, (req, done) => {

    knex
      .select()
      .from(tables.collaboration)
      .where({
        [tables.installation]: req.id,
        [tables.user]: req.userid
      })
      .asCallback(tools.singleExtractor(done))

  })

  /*
  
    create
    
  */
  hemera.add({
    topic: 'installation-storage',
    cmd: 'create',
    userid: Joi.number().required(),
    data: Joi.object().keys({
      name: Joi.string().required(),
      meta: Joi.object().required()
    })
  }, (req, done) => {

    knex.transaction(function(trx) {
      return knex
        .insert(req.data)
        .into(tables.installation)
        .returning('*')
        .then((installation) => {

          return knex
            .insert({
              [tables.installation]: installation.id,
              [tables.user]: req.userid,
              permission: 'owner'
            })
            .into(tables.collaboration)
            .returning('*')
            .then((collaboration) => installation[0])

        })
    })
    .then((installation) => {
      done(null, installation)
    })
    .catch(done)
  })

  /*
  
    save
    
  */
  hemera.add({
    topic: 'installation-storage',
    cmd: 'save',
    id: Joi.number().required(),
    data: Joi.object().keys({
      name: Joi.string().required(),
      meta: Joi.object().required()
    })
  }, (req, done) => {

    hemera.act({
      topic: 'sql-store-addons',
      cmd: 'update',
      collection: tables.installation,
      query: { id: req.id },
      data: req.data
    }, tools.singleExtractor(done))

  })


  /*
  
    update - merges meta data top-level keys
    
  */
  hemera.add({
    topic: 'installation-storage',
    cmd: 'update',
    id: Joi.number().required(),
    data: Joi.object().required()
  }, (req, done) => {
    hemera.act({
      topic: 'sql-store',
      cmd: 'findById',
      collection: tables.installation,
      id: req.id
    }, tools.singleExtractor((err, installation) => {
      if(err) return done(err)
      const meta = Object.assign({}, installation.meta, req.data)
      hemera.act({
        topic: 'sql-store-addons',
        cmd: 'update',
        collection: tables.installation,
        query: { id: req.id },
        data: { meta }
      }, tools.singleExtractor(done))
    }))
    
  })


  /*
  
    delete
    
  */
  hemera.add({
    topic: 'installation-storage',
    cmd: 'delete',
    id: Joi.number().required()
  }, (req, done) => {

    hemera.act({
      topic: 'sql-store',
      cmd: 'removeById',
      collection: tables.installation,
      id: req.id
    }, done)

  })


}

module.exports = InstallationStorageSQL