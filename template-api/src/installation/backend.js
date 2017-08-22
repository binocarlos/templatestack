'use strict'

const options = require('template-tools/src/utils/options')
const async = require('async')
const tools = require('../transport/tools')

const REQUIRED = [
  'hooks',
  'storage'
]

const REQUIRED_HOOKS = [
  'authUpdate',
  'authEnsure' 
]

const REQUIRE_STORAGE_METHODS = [
  'loadById',
  'list',
  'create',
  'save',
  'update',
  'del',
  'user_collaborations',
  'list_users',
  'add_user_collaboration',
  'delete_user_collaboration'
]

const DEFAULTS = {
  installationTemplate: {
    name: 'default installation',
    meta: {}
  },
  collaborationTemplate: {
    permission: 'owner',
    type: 'user'
  }
}

const InstallationBackend = (hemera, opts) => {
  const Joi = hemera.exposition['hemera-joi'].joi

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const hooks = options.processor(opts.hooks, {
    required: REQUIRED_HOOKS
  })

  const TOPIC = opts.topic
  const STORAGE_TOPIC = opts.storageTopic
  const AUTH_TOPIC = opts.authTopic
  const INSTALLATION_TEMPLATE = opts.installationTemplate
  const COLLABORATION_TEMPLATE = opts.collaborationTemplate

  /*
  
    get

      * id

    
  */

  const get = (call, done) => {
    storage.loadById({
      id: call.request.id
    }, done)
  }


  /*
  
    list

      * userid
    
  */
  const list = (call, done) => {
    storage.list({
      userid: call.request.userid
    }, done)
  }


  /*
  
    call

      * userid
      * data
        * name
        * meta
    
  */
  const create = (call, done) => {
    storage.create({
      userid: call.request.userid,
      data: call.request.data,
      collaboration: COLLABORATION_TEMPLATE
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
        hooks.authEnsure({
          data: call.request.userdata
        }, next)
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