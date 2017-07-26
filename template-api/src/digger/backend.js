'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const async = require('async')
const options = require('template-tools/src/utils/options')
const databaseTools = require('../database/tools')
const tools = require('./tools')

const Logic = require('./backend_logic')

const REQUIRED = [
  'storage'
]

const DEFAULTS = {
  topic: 'digger'
}

/*

  user namespace
  
*/
const DiggerBackend = (hemera, opts) => {
  let Joi = hemera.exposition['hemera-joi'].joi

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const TOPIC = opts.topic

  const storage = opts.storage
  const logic = Logic(storage)

  /*
  
    loadById
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'get',
    installationid: Joi.number().required(),
    id: Joi.number().required(),
    withLinks: Joi.boolean()
  }, (req, done) => {

    async.waterfall([
      (next) => logic.getResource(req.id, next),
      (resource, next) => {
        if(!resource) return next()
        if(!req.withLinks) return next(null, resource)
        logic.injectLinks({
          installationid: req.installationid,
          resources: [resource]
        }, (err, resources) => {
          if(err) return next(err)
          next(null, resources[0])
        })
      }
    ], done)
    
  })

  /*
  
    search
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'search',
    installationid: Joi.number().required(),
    type: Joi.string(),
    search: Joi.string()
  }, (req, done) => {

    logic.search({
      installationid: req.installationid,
      type: req.type,
      search: req.search
    }, done)
    
  })

  /*
  
    children
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'children',
    installationid: Joi.number().required(),
    id: Joi.number().required(),
    withLinks: Joi.boolean()
  }, (req, done) => {

    const query = {
      installationid: req.installationid,
      id: req.id
    }

    async.waterfall([
      (next) => logic.children(query, next),
      (children, next) => {
        if(!children) return next()
        if(!req.withLinks) return next(null, children)

        logic.injectLinks({
          installationid: req.installationid,
          resources: children
        }, next)
        
      }
    ], done)
    
  })


  /*
  
    descendents
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'descendents',
    installationid: Joi.number().required(),
    id: Joi.number().required(),
    type: Joi.string(),
    search: Joi.string(),
    withLinks: Joi.boolean()
  }, (req, done) => {

    const query = {
      installationid: req.installationid,
      id: req.id,
      type: req.type,
      search: req.search
    }

    async.waterfall([
      (next) => logic.descendents(query, next),
      (descendents, next) => {
        if(!descendents) return next()
        if(!req.withLinks) return next(null, descendents)

        logic.injectLinks({
          installationid: req.installationid,
          resources: descendents
        }, next)
        
      }
    ], done)
    
  })

  /*
  
    links
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'links',
    installationid: Joi.number().required(),
    id: Joi.number(),
    follow: Joi.boolean()
  }, (req, done) => {

    const linkQuery = {
      installationid: req.installationid,
      id: req.id
    }

    req.follow ?
      logic.linkTree(linkQuery, done) :
      logic.linkChildren(linkQuery, done)
    
  })


  /*
  
    create
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'create',
    installationid: Joi.number().required(),
    parentid: Joi.number(),
    data: Joi.object().required()
  }, (req, done) => {

    const {
      installationid,
      parentid,
      data
    } = req

    logic.transaction((trx, finish) => {
      logic.create(trx, {
        installationid,
        parentid,
        data
      }, finish)
    }, done)
    
  })


  /*
  
    save
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'save',
    installationid: Joi.number().required(),
    id: Joi.number().required(),
    data: Joi.object().required()
  }, (req, done) => {

    const {
      installationid,
      id,
      data
    } = req

    logic.transaction((trx, finish) => {
      logic.save(trx, {
        installationid,
        id,
        data
      }, finish)
    }, done)
    
  })



  /*
  
    delete
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'delete',
    installationid: Joi.number().required(),
    id: Joi.number().required()
  }, (req, done) => {

    const {
      installationid,
      id
    } = req

    logic.transaction((trx, finish) => {
      logic.del(trx, {
        installationid,
        id
      }, finish)
    }, done)
    
  })


  /*
  
    paste
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'paste',
    installationid: Joi.number().required(),
    parentid: Joi.number().required(),
    ids: Joi.array().required(),
    mode: Joi.string()
  }, (req, done) => {

    const {
      installationid,
      parentid,
      ids,
      mode
    } = req

    logic.transaction((trx, finish) => {
      logic.paste(trx, {
        installationid,
        parentid,
        ids,
        mode
      }, finish)
    }, done)
    
  })


  /*
  
    swap
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'swap',
    installationid: Joi.number().required(),
    source: Joi.number().required(),
    target: Joi.number().required(),
    mode: Joi.string()
  }, (req, done) => {

    const {
      installationid,
      source,
      target,
      mode
    } = req

    logic.transaction((trx, finish) => {
      logic.swap(trx, {
        installationid,
        source,
        target,
        mode
      }, finish)
    }, done)
    
  })

}

module.exports = DiggerBackend