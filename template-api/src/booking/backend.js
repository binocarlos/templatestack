'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const async = require('async')
const options = require('../utils/options')
const databaseTools = require('../database/tools')

const REQUIRED = [
  'storage'
]

const DEFAULTS = {
  topic: 'booking'
}

/*

  user namespace
  
*/
const BookingBackend = (hemera, opts) => {
  let Joi = hemera.exposition['hemera-joi'].joi

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const TOPIC = opts.topic

  const storage = opts.storage

  /*
  
    search

    * installationid
    * search
    * from
    * to
    * type
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'search',
    installationid: Joi.number().required(),
    search: Joi.string(),
    from: Joi.string(),
    to: Joi.string(),
    type: Joi.string()
  }, (req, done) => {

    storage.search({
      installationid: req.installationid,
      search: req.search,
      from: req.from,
      to: req.to,
      type: req.type
    }, done)
  })

}

module.exports = BookingBackend