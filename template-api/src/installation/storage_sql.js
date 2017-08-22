'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const async = require('async')
const options = require('template-tools/src/utils/options')
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
const InstallationStorageSQL = (opts) => {
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
  ${tables.collaboration}.meta as collaboration,
  ${tables.user}.*
from
  ${tables.user}
join
  ${tables.collaboration}
on
  (${tables.collaboration}.${tables.user} = ${tables.user}.id)
  and
  (${tables.collaboration}.${tables.installation} = ?)
where
  ${
    Object
      .keys(meta)
      .map(key => `json_extract_path_text(${tables.collaboration}.meta, '${key}') = ?`)
      .join("\n and \n")
  }
`

  const createCollaboration = ({ installationid, userid, meta } = opts) => {
    return knex
      .insert({
        [tables.installation]: installationid,
        [tables.user]: userid,
        meta
      })
      .into(tables.collaboration)
      .returning('*')
  }

  /*
  
    loadById

      * id
    
  */
  const loadById = (req, done) => {
    knex(tables.installation)
      .where('id', req.id)
      .asCallback(tools.singleExtractor(done))
  }

  /*
  
    list

      * userid
    
  */
  const list = (req, done) => {
    knex
      .raw(LIST_INSTALLATION_QUERY(), [req.userid])
      .asCallback(tools.allExtractor(done))
  }
  

  /*
  
    create

      * userid
      * data
        * name
        * meta
      * collaboration
        * ?
    
  */
  const create = (req, done) => {
    knex.transaction(function(trx) {
      return knex
        .insert(req.data)
        .into(tables.installation)
        .returning('*')
        .then((installations) => {

          const installation = installations[0]
          
          return createCollaboration({
            installationid: installation.id,
            userid: req.userid,
            meta: req.collaboration
          }).then((collaboration) => installation)

        })
    })
    .then((installation) => {
      done(null, installation)
    })
    .catch(done)
  }

  /*
  
    save

      * id
      * data
        * name
        * meta
    
  */

  const save = (req, done) => {
    knex(tables.installation)
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
    loadById({
      id: req.id
    }, (err, installation) => {
      if(err) return done(err)
      const meta = Object.assign({}, installation.meta, req.data)
      knex(tables.installation)
        .where({id: req.id})
        .update({
          meta
        })
        .asCallback(tools.singleExtractor(done))
    })
  }

  /*
  
    delete

      * id
    
  */
  const del = (req, done) => {
    knex(tables.installation)
      .where({
        id: req.id
      })
      .del()
      .asCallback(done)
  }


  /*
  
    list_user_collaborations

      * id
      * userid
    
  */
  const user_collaborations = (req, done) => {
    knex
      .select()
      .from(tables.collaboration)
      .where({
        [tables.installation]: req.id,
        [tables.user]: req.userid
      })
      .asCallback(tools.allExtractor(done))
  }

  /*
  
    list_users

      * id
      * meta
    
  */
  const list_users = (req, done) => {
    knex
      .raw(LIST_USERS_QUERY(req.meta), [req.id].concat(Object.values(req.meta)))
      .asCallback(tools.allExtractor(done))
  }

  /*
  
    add_user_collaboration

      * id
      * userid
      * meta
    
  */
  const add_user_collaboration = (req, done) => {
    createCollaboration({
      installationid: req.id,
      userid: req.userid,
      meta: req.meta
    }).asCallback(tools.singleExtractor(done))
  }

  /*
  
    delete_user_collaboration

      * id
      * userid
    
  */
  const delete_user_collaboration = (req, done) => {
    knex(tables.collaboration)
    .where({
      [tables.installation]: req.id,
      [tables.user]: req.userid
    })
    .del()
    .asCallback(tools.singleExtractor(done))
  }
  
  return {
    loadById,
    list,
    create,
    save,
    update,
    del,
    user_collaborations,
    list_users,
    add_user_collaboration,
    delete_user_collaboration
  }


}

module.exports = InstallationStorageSQL