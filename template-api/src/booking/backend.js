'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const async = require('async')
const options = require('../utils/options')
const databaseTools = require('../database/tools')

const REQUIRED = [
  'storage',
  'hooks'
]

const REQUIRED_HOOKS = [
  'create',
  'save',
  'del'
]

const DEFAULTS = {
  topic: 'booking',
  // a function to check if a slot has any space
  // return an error if the booking cannot be made
  checkBookingSlot: (booking, done) => done()
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

  const hooks = options.processor(opts.hooks, {
    required: REQUIRED_HOOKS
  })

  const TOPIC = opts.topic

  const storage = opts.storage
  const checkBookingSlot = opts.checkBookingSlot

  /*
  
    load

    * id
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'load',
    installationid: Joi.number().required(),
    id: Joi.number().required()
  }, (req, done) => {

    storage.get({
      id: req.id,
      installationid: req.installationid
    }, done)

  })

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

  /*
  
    create

    it is assumed that (in this order):

    * space for the booking has been checked
    * the payment is taken and written to the payment table

    fields:

    * installationid
    * data
      * name
      * date
      * type
      * slot
      * meta
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'create',
    installationid: Joi.number().required(),
    data: Joi.object().keys({
      name: Joi.string().required(),
      date: Joi.string().required(),
      type: Joi.string().required(),
      slot: Joi.string().required(),
      meta: Joi.object()
    })
  }, (req, done) => {
    storage.transaction((trx, finish) => {
      async.waterfall([
        (next) => {
          storage.create(trx, {
            installationid: req.installationid,
            data: req.data
          }, next)
        },
        (booking, next) => {
          hooks.create({trx}, booking, (err) => {
            if(err) return next(err)
            next(null, booking)
          })
        }
      ], finish)
    }, done)
  })

  /*
  
    save

    * id
    * data
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'save',
    installationid: Joi.number().required(),
    id: Joi.number().required(),
    data: Joi.object().required()
  }, (req, done) => {

    storage.transaction((trx, finish) => {
      async.waterfall([
        (next) => {
          storage.save(trx, {
            id: req.id,
            installationid: req.installationid,
            data: req.data
          }, next)
        },
        (booking, next) => {
          hooks.save({trx}, booking, (err) => {
            if(err) return next(err)
            next(null, booking)
          })
        }
      ], finish)
    }, done)

  })


  /*
  
    del

    * id
    * data
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'del',
    installationid: Joi.number().required(),
    id: Joi.number().required()
  }, (req, done) => {


    storage.transaction((trx, finish) => {
      async.waterfall([
        (next) => {
          storage.del(trx, {
            id: req.id,
            installationid: req.installationid
          }, next)
        },
        (booking, next) => {
          hooks.del({trx}, booking, (err) => {
            if(err) return next(err)
            next(null, booking)
          })
        }
      ], finish)
    }, done)

  })

}

module.exports = BookingBackend