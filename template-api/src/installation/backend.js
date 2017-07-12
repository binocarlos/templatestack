'use strict'

const options = require('../utils/options')
const async = require('async')
const tools = require('../transport/tools')

const REQUIRED = [
  'hooks'
]

const REQUIRED_HOOKS = [
  
]

const DEFAULTS = {
  topic: 'installation',
  storageTopic: 'installation-storage',
  authTopic: 'auth',
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

  // get
  tools.backend(hemera, {
    inbound: {
      topic: TOPIC,
      cmd: 'get'
    },
    outbound: {
      topic: STORAGE_TOPIC,
      cmd: 'loadById'
    },
    query: {
      id: Joi.number().required()
    }
  })

  // list
  tools.backend(hemera, {
    inbound: {
      topic: TOPIC,
      cmd: 'list'
    },
    outbound: {
      topic: STORAGE_TOPIC,
      cmd: 'list'
    },
    query: {
      userid: Joi.number().required()
    }
  })



  // create
  hemera.add({
    topic: TOPIC,
    cmd: 'create',
    userid: Joi.number().required(),
    data: Joi.object().keys({
      name: Joi.string().required(),
      meta: Joi.object().required()
    })
  }, (req, done) => {

    hemera.act({
      topic: STORAGE_TOPIC,
      cmd: 'create',
      userid: req.userid,
      data: req.data,
      collaboration: COLLABORATION_TEMPLATE
    }, done)

  })

  // createDefault
  hemera.add({
    topic: TOPIC,
    cmd: 'createDefault',
    userid: Joi.number().required()
  }, (req, done) => {

    hemera.act({
      topic: TOPIC,
      cmd: 'create',
      userid: req.userid,
      data: INSTALLATION_TEMPLATE
    }, (err, installation) => {
      if(err) return done(new Error(err))

      hemera.act({
        topic: TOPIC,
        cmd: 'activate',
        userid: req.userid,
        id: installation.id
      }, done)
    })
  })

  // activate
  hemera.add({
    topic: TOPIC,
    cmd: 'activate',
    id: Joi.number().required(),
    userid: Joi.number().required()
  }, (req, done) => {
    hemera.act({
      topic: AUTH_TOPIC,
      cmd: 'update',
      id: req.userid,
      data: {
        activeInstallation: req.id
      }
    }, done)
  })


  // save
  tools.backend(hemera, {
    inbound: {
      topic: TOPIC,
      cmd: 'save'
    },
    outbound: {
      topic: STORAGE_TOPIC,
      cmd: 'save'
    },
    query: {
      id: Joi.number().required(),
      data: Joi.object().keys({
        name: Joi.string(),
        meta: Joi.object()
      })
    }
  })

  // update
  tools.backend(hemera, {
    inbound: {
      topic: TOPIC,
      cmd: 'update'
    },
    outbound: {
      topic: STORAGE_TOPIC,
      cmd: 'update'
    },
    query: {
      id: Joi.number().required(),
      data: Joi.object()
    }
  })


  // delete
  tools.backend(hemera, {
    inbound: {
      topic: TOPIC,
      cmd: 'delete'
    },
    outbound: {
      topic: STORAGE_TOPIC,
      cmd: 'delete'
    },
    query: {
      id: Joi.number().required()
    }
  })


  // load all collaborations for a given user / installation
  tools.backend(hemera, {
    inbound: {
      topic: TOPIC,
      cmd: 'user_collaborations'
    },
    outbound: {
      topic: STORAGE_TOPIC,
      cmd: 'user_collaborations'
    },
    query: {
      id: Joi.number().required(),
      userid: Joi.number().required()
    }
  })


  // list users with matching collab meta for a given installation
  tools.backend(hemera, {
    inbound: {
      topic: TOPIC,
      cmd: 'list_users'
    },
    outbound: {
      topic: STORAGE_TOPIC,
      cmd: 'list_users'
    },
    query: {
      id: Joi.number().required(),
      meta: Joi.object().required()
    }
  })
  
  // add a new user to an installation
  // this means ensuring the useraccount with auth
  // then adding a collaboration of the given meta to the installation
  hemera.add({
    topic: TOPIC,
    cmd: 'add_user',
    id: Joi.number().required(),
    userdata: Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required()
    }),
    collaboration: Joi.object().required()
  }, (req, done) => {

    async.waterfall([
      (next) => {
        hemera.act({
          topic: AUTH_TOPIC,
          cmd: 'ensure',
          data: req.userdata
        }, done)
      },

      (user, next) => {
        hemera.act({
          topic: STORAGE_TOPIC,
          cmd: 'add_user_collaboration',
          id: req.id,
          userid: user.id,
          meta: req.collaboration
        }, (err) => {
          if(err) return next(err)
          next(null, user)
        })
      }
    ], (err, user) => {
      if(err) return done(new Error(err))
      done(null, user)
    })
  })

  tools.backend(hemera, {
    inbound: {
      topic: TOPIC,
      cmd: 'delete_user'
    },
    outbound: {
      topic: STORAGE_TOPIC,
      cmd: 'delete_user_collaboration'
    },
    query: {
      id: Joi.number().required(),
      userid: Joi.number().required()
    }
  })
}

module.exports = InstallationBackend