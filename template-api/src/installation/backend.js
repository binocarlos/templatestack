'use strict'

const options = require('../utils/options')
const async = require('async')
const tools = require('../transport/tools')

const REQUIRED = [
  'hooks'
]

const REQUIRED_HOOKS = [
  'registered' 
]

const DEFAULTS = {
  defaultName: 'default installation'
}

const InstallationBackend = (hemera, opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const hooks = options.processor(opts.hooks, {
    required: REQUIRED_HOOKS
  })

  const Joi = hemera.exposition['hemera-joi'].joi

  // get
  tools.backend(hemera, {
    inbound: {
      topic: 'installation',
      cmd: 'get'
    },
    outbound: {
      topic: 'installation-storage',
      cmd: 'loadById'
    },
    query: {
      id: Joi.number().required()
    }
  })

  // list
  tools.backend(hemera, {
    inbound: {
      topic: 'installation',
      cmd: 'list'
    },
    outbound: {
      topic: 'installation-storage',
      cmd: 'list'
    },
    query: {
      userid: Joi.number().required()
    }
  })



  // create
  hemera.add({
    topic: 'installation',
    cmd: 'create',
    userid: Joi.number().required(),
    data: Joi.object().keys({
      name: Joi.string().required(),
      meta: Joi.object().required()
    })
  }, (req, done) => {

    hemera.act({
      topic: 'installation-storage',
      cmd: 'create',
      userid: req.userid,
      data: req.data,
      collaboration: {
        permission: 'owner'
      }
    }, done)

  })

  // createDefault
  hemera.add({
    topic: 'installation',
    cmd: 'createDefault',
    userid: Joi.number().required()
  }, (req, done) => {

    hemera.act({
      topic: 'installation',
      cmd: 'create',
      userid: req.userid,
      data: {
        name: opts.defaultName,
        meta: {}
      }
    }, (err, installation) => {
      if(err) return done(new Error(err))

      hemera.act({
        topic: 'installation',
        cmd: 'activate',
        userid: req.userid,
        id: installation.id
      }, done)
    })
  })

  // activate
  hemera.add({
    topic: 'installation',
    cmd: 'activate',
    id: Joi.number().required(),
    userid: Joi.number().required()
  }, (req, done) => {
    hemera.act({
      topic: 'auth',
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
      topic: 'installation',
      cmd: 'save'
    },
    outbound: {
      topic: 'installation-storage',
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
      topic: 'installation',
      cmd: 'update'
    },
    outbound: {
      topic: 'installation-storage',
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
      topic: 'installation',
      cmd: 'delete'
    },
    outbound: {
      topic: 'installation-storage',
      cmd: 'delete'
    },
    query: {
      id: Joi.number().required()
    }
  })


  // list users with matching collab meta for a given installation
  tools.backend(hemera, {
    inbound: {
      topic: 'installation',
      cmd: 'list_users'
    },
    outbound: {
      topic: 'installation-storage',
      cmd: 'list_users'
    },
    query: {
      id: Joi.number().required(),
      meta: Joi.object().required()
    }
  })
  
  // load all collaborations for a given user / installation
  tools.backend(hemera, {
    inbound: {
      topic: 'installation',
      cmd: 'list_user_collaborations'
    },
    outbound: {
      topic: 'installation-storage',
      cmd: 'list_user_collaborations'
    },
    query: {
      id: Joi.number().required(),
      userid: Joi.number().required()
    }
  })

  

}

module.exports = InstallationBackend