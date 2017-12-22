'use strict'

const options = require('template-tools/src/utils/options')
const async = require('async')

const REQUIRED = [
  'knex'
]

const DEFAULTS = {
  installationTemplate: {
    name: 'default installation',
    meta: {}
  },
  collaborationTemplate: {
    permission: 'owner',
    type: 'user'
  },
  projectTable: 'project',
  collaborationTable: 'collaboration',
  userTablename: 'useraccount'
}

const ProjectBackend = (opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  /*
  
    --------------------------------------------

    VARS

    --------------------------------------------
    
  */
  const tables = {
    project: opts.projectTable,
    collaboration: opts.collaborationTable,
    user: opts.userTablename
  }

  const knex = opts.knex

  const INSTALLATION_TEMPLATE = opts.installationTemplate
  const COLLABORATION_TEMPLATE = opts.collaborationTemplate

  const LIST_PROJECT_QUERY = () => `select 
  ${tables.project}.*
from
  ${tables.project}
join
  ${tables.collaboration}
on
  (${tables.collaboration}.${tables.project} = ${tables.project}.id)
where
  ${tables.project}.${tables.user} = ?
order by
  ${tables.project}.name
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
  (${tables.collaboration}.${tables.project} = ?)
where
  ${
    Object
      .keys(meta)
      .map(key => `json_extract_path_text(${tables.collaboration}.meta, '${key}') = ?`)
      .join("\n and \n")
  }
`

  
  /*
  
    --------------------------------------------

    HELPERS

    --------------------------------------------
    
  */
  const transaction = (handler, done) => databaseTools.knexTransaction(knex, handler, done)


  const createCollaboration = (opts, done) => {
    const { projectid, userid, meta } = opts
    knex
      .insert({
        [tables.project]: projectid,
        [tables.user]: userid,
        meta
      })
      .into(tables.collaboration)
      .returning('*')
      .asCallback(databaseTools.singleExtractor(done))
  }

  /*
  
    --------------------------------------------

    QUERIES

    --------------------------------------------
    
  */

  const get = (call, done) => {
    const { id } = call.request
    knex(tables.project)
      .where('id', id)
      .asCallback(tools.singleExtractor(done))
  }

  const list = (call, done) => {
    const { userid } = call.request
    knex
      .raw(LIST_INSTALLATION_QUERY(), [userid])
      .asCallback(tools.allExtractor(done))
  }

  /*
  
    --------------------------------------------

    COMMANDS

    --------------------------------------------
    
  */

  /*
  
    call

      * userid
      * data
        * name
        * meta
    
  */
  const create = (call, done) => {

    const {
      userid,
      data
    } = call.request

    transaction((trx, finish) => {

      knex
        .insert(data)
        .into(tables.project)
        .returning('*')
        .asCallback(databaseTools.singleExtractor((err, project) => {
          if(err) return finish(err)
          createCollaboration({
            projectid: project.id,
            userid: userid,
            meta: COLLABORATION_TEMPLATE
          }, (err, collaboration) => {
            if(err) return finish(err)
            return finish(null, project)
          })
        }))

    }, done)
  }
  
  /*
  
    createDefault

      * userid
    
  */
  const createDefault = (call, done) => {
    create({
      request: {
        userid: call.request.userid,
        data: INSTALLATION_TEMPLATE
      }
    }, (err, installation) => {
      if(err) return done(err)
      if(!installation) return done('no installation created')
      activate({
        request: {
          userid: call.request.userid,
          id: installation.id
        }
      }, done)
    })
  }


  /*
  
    activate

      * id
      * userid
    
  */
  const activate = (call, done) => {
    hooks.authUpdate({
      id: call.request.userid,
      data: {
        activeInstallation: call.request.id
      }
    }, done)
  }


  /*
  
    save

      * id
      * data
        * name
        * meta
    
  */
  const save = (call, done) => {
    storage.save({
      id: call.request.id,
      data: call.request.data
    }, done)
  }

  /*
  
    update

      * id
      * data
    
  */
  const update = (call, done) => {
    storage.update({
      id: call.request.id,
      data: call.request.data
    }, done)
  }
  
  /*
  
    del

      * id
    
  */
  const del = (call, done) => {
    storage.del({
      id: call.request.id
    }, done)
  }

  /*
  
    user_collaborations

      * id
      * userid
    
  */
  const user_collaborations = (call, done) => {
    storage.user_collaborations({
      id: call.request.id,
      userid: call.request.userid
    }, done)
  }

  /*
  
    list_users
    list users with matching collab meta for a given installation

      * id
      * meta
    
  */
  const list_users = (call, done) => {
    storage.list_users({
      id: call.request.id,
      meta: call.request.meta
    }, done)
  }

  /*
  
    add_user

    add a new user to an installation
    this means ensuring the useraccount with auth
    then adding a collaboration of the given meta to the installation

      * id
      * userdata
        * username
        * password
      * collaboration
    
  */
  const add_user = (call, done) => {
    async.waterfall([
      (next) => {
        hooks.authEnsure(call.request.userdata, next)
      },

      (user, next) => {
        storage.add_user_collaboration({
          id: call.request.id,
          userid: user.id,
          meta: call.request.collaboration
        }, (err) => {
          if(err) return next(err)
          next(null, user)
        })
      }
    ], done)
  }
  
  /*
  
    delete_user

      * id
      * userid
    
  */
  const delete_user = (call, done) => {
    storage.delete_user_collaboration({
      id: call.request.id,
      userid: call.request.userid
    }, done)
  }

  return {
    get,
    list,
    create,
    createDefault,
    activate,
    save,
    update,
    del,
    user_collaborations,
    list_users,
    add_user,
    delete_user
  }
}

module.exports = InstallationBackend