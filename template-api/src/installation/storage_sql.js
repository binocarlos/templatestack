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

  const LIST_INSTALLATION_QUERY = (req) => {
    let params = [req.userid]
    let searchSql = ''

    if(req.search) {
      searchSql = `and ${tables.installation}.name ILIKE ?`
      params.push(`%${req.search}%`)
    }
    
    const sql = `select 
  ${tables.installation}.*
from
  ${tables.installation}
join
  ${tables.collaboration}
on
  (${tables.collaboration}.${tables.installation} = ${tables.installation}.id)
where
  ${tables.collaboration}.${tables.user} = ?
  ${searchSql}
order by
  installation.name
`

    return {
      sql,
      params
    }
  }

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

const LIST_COLLABORATIONS_QUERY = (meta = {}) => `select
  json_extract_path_text(${tables.collaboration}.meta, 'permission') as collaboration_permission,
  json_extract_path_text(${tables.collaboration}.meta, 'type') as collaboration_type,
  ${tables.user}.*
from
  ${tables.user}
join
  ${tables.collaboration}
on
  (${tables.collaboration}.${tables.user} = ${tables.user}.id)
  and
  (${tables.collaboration}.${tables.installation} = ?)
`

  const transaction = (handler, done) => tools.knexTransaction(knex, handler, done)

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

    async.parallel({
      installation: (next) => {
        knex(tables.installation)
          .where('id', req.id)
          .asCallback(tools.singleExtractor(next))
      },
      collaborators: (next) => {
        list_collaborators({
          id: req.id
        }, next)
      }
    }, (err, results) => {
      if(err) return done(err)
      const installation = results.installation
      installation.collaborators = results.collaborators
      done(null, installation)
    })
    
  }

  /*
  
    list

      * userid
      * search
    
  */
  const list = (req, done) => {
    const query = LIST_INSTALLATION_QUERY(req)
    knex
      .raw(query.sql, query.params)
      .asCallback(tools.allExtractor(done))
  }

  const deleteCollaborations = (id, done) => {
    knex(tables.collaboration)
      .where({
        installation: id
      })
      .del()
      .asCallback(done)
  }

  const createCollaborations = (id, collaborators, done) => {
    async.map(collaborators, (collaborator, next) => {
      const req = createCollaboration({
        installationid: id,
        userid: collaborator.id,
        meta: {
          permission: collaborator.collaboration_permission,
          type: 'user'
        }
      })
      req.asCallback(tools.singleExtractor(next))
    }, done)
  }
  

  /*
  
    create

      * userid
      * data
        * name
        * meta
        * collaborators
    
  */
  const create = (req, done) => {
    const insertData = Object.assign({}, req.data)
    const collaborators = insertData.collaborators
    delete(insertData.collaborators)
    transaction((trx, finish) => {
      async.waterfall([
        (next) => {
          return knex
            .insert(insertData)
            .into(tables.installation)
            .returning('*')
            .asCallback(tools.singleExtractor(next))
        },
        (installation, next) => {
          createCollaborations(installation.id, collaborators, next)
        }
      ], finish)
    }, done)
  }

  /*
  
    save

      * id
      * data
        * name
        * meta
    
  */

  const save = (req, done) => {
    const saveData = Object.assign({}, req.data)
    const collaborators = saveData.collaborators
    delete(saveData.collaborators)
    transaction((trx, finish) => {
      async.series([
        (next) => {
          knex(tables.installation)
            .where({id: req.id})
            .update(saveData)
            .asCallback(tools.singleExtractor(next))
        },
        (next) => {
          deleteCollaborations(req.id, next)
        },
        (next) => {
          createCollaborations(req.id, collaborators, next)
        }
      ], finish)
    }, done)    
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
  
    list_collaborators

      * id
    
  */
  const list_collaborators = (req, done) => {
    knex
      .raw(LIST_COLLABORATIONS_QUERY(), [req.id])
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