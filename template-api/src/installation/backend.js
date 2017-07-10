'use strict'

const options = require('../utils/options')
const async = require('async')
const tools = require('../transport/tools')

const REQUIRED = [
  
]

const DEFAULTS = {

  
}

const InstallationBackend = (hemera, opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const Joi = hemera.exposition['hemera-joi'].joi

  /*
  
    get
    
  */
  tools.backend(hemera, {
    inbound: {
      topic: 'installation',
      cmd: 'get'
    },
    outbound: {
      topic: 'installation-storage',
      cmd: 'load'
    },
    query: {
      id: Joi.number().required(),
      userid: Joi.number().required()
    }
  })

  /*
  
    list
    
  */
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

  /*
  
    loadCollaboration
    
  */
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

  /*
  
    permission
    
  */
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

  /*
  
    create
    
  */
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



}

module.exports = InstallationBackend