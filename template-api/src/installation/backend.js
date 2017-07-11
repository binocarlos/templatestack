'use strict'

const options = require('../utils/options')
const async = require('async')
const tools = require('../transport/tools')

const REQUIRED = [
  
]

const DEFAULTS = {
  defaultName: 'default installation'
}

const InstallationBackend = (hemera, opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
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

  // loadCollaboration
  tools.backend(hemera, {
    inbound: {
      topic: 'installation',
      cmd: 'loadCollaboration'
    },
    outbound: {
      topic: 'installation-storage',
      cmd: 'loadCollaboration'
    },
    query: {
      id: Joi.number().required(),
      userid: Joi.number().required()
    }
  })

  // permission
  tools.backend(hemera, {
    inbound: {
      topic: 'installation',
      cmd: 'permission'
    },
    outbound: {
      topic: 'installation-storage',
      cmd: 'loadCollaboration'
    },
    query: {
      id: Joi.number().required(),
      userid: Joi.number().required()
    },
    map: (collaboration) => collaboration.permission
  })

  // create
  tools.backend(hemera, {
    inbound: {
      topic: 'installation',
      cmd: 'create'
    },
    outbound: {
      topic: 'installation-storage',
      cmd: 'create'
    },
    query: {
      userid: Joi.number().required(),
      data: Joi.object().keys({
        name: Joi.string().required(),
        meta: Joi.object().required()
      })
    }
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
      if(err) return done(err)

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
      userid: Joi.number().required(),
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
      userid: Joi.number().required(),
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
      id: Joi.number().required(),
      userid: Joi.number().required()
    }
  })

  // create default
  if(opts.createDefaultInstallation) {
    hemera.add({
      pubsub$: true,
      topic: 'auth',
      cmd: 'registered',
      user: Joi.object().required()
    }, (req) => {
      console.log('-------------------------------------------');
      console.log('-------------------------------------------');
      console.log('-------------------------------------------');
      console.log('USER IS REGISTERED')
      console.log(JSON.stringify(req, null, 4))
    })
  }



}

module.exports = InstallationBackend