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

  const LIST_INSTALLATION_QUERY = () => `select 
  ${tables.installation}.*
from
  ${tables.installation}
join
  ${tables.collaboration}
on
  (${tables.collaboration}.${tables.installation} = ${tables.installation}.id)
where
  ${tables.collaboration}.${tables.user} = ?
order by
  installation.name
`

  const LIST_USERS_QUERY = (meta = {}) => `select
  }
  ${tables.user}.*
from
  ${tables.user}
join
  ${tables.collaboration}
on
  (${tables.collaboration}.${tables.user} = ${tables.user}.id)
  and
  (${tables.collaboration}.${tables.installation} = ?
where
  ${
    Object
      .keys(meta)
      .map(key => `json_extract_path_text(${tables.collaboration}.meta, '${key}') = ?`)
      .join("\n and \n")
  }
order by
  installation.name
`

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
      .raw(LIST_INSTALLATION_QUERY(), [req.userid])
      .asCallback(tools.allExtractor(done))

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
    }),
    collaboration: Joi.object()
  }, (req, done) => {

    knex.transaction(function(trx) {
      return knex
        .insert(req.data)
        .into(tables.installation)
        .returning('*')
        .then((installations) => {

          const installation = installations[0]
          
          return knex
            .insert({
              [tables.installation]: installation.id,
              [tables.user]: req.userid,
              meta: req.collaboration
            })
            .into(tables.collaboration)
            .returning('*')
            .then((collaboration) => installation)

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
      if(err) return done(new Error(err))
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


  /*
  
    list_users
    
  */
  hemera.add({
    topic: 'installation-storage',
    cmd: 'list_users',
    id: Joi.number().required(),
    meta: Joi.object().required()
  }, (req, done) => {
    knex
      .raw(LIST_USERS_QUERY(req.meta), [req.id].concat(Object.values(req.meta)))
      .asCallback(tools.allExtractor(done))
  })

  /*
  
     '
    
  */
  hemera.add({
    topic: 'installation-storage',
    cmd: 'list_user_collaborations',
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
      .asCallback(tools.allExtractor(done))

  })


}

module.exports = InstallationStorageSQL