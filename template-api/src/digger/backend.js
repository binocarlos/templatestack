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
  
}

/*

  user namespace
  
*/
const DiggerBackend = (opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const storage = opts.storage
  const logic = Logic(storage)

  /*
  
    loadById

      * installationid
      * id
      * withLinks
    
  */
  const loadById = (call, done) => {
    const req = call.request
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
  }
  

  /*
  
    search

      * installationid
      * type
      * search
    
  */
  const search = (call, done) => {
    const req = call.request
    logic.search({
      installationid: req.installationid,
      type: req.type,
      search: req.search
    }, done)
  }
  
  /*
  
    children

      * installationid
      * id
      * type
      * search
      * withLinks
    
  */
  const children = (call, done) => {
    const req = call.request

    const query = {
      installationid: req.installationid,
      id: req.id,
      type: req.type,
      search: req.search
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
    
  }


  /*
  
    descendents

      * installationid
      * id
      * type
      * search
      * withLinks
    
  */
  const descendents = (call, done) => {
    const req = call.request
  
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
    
  }

  /*
  
    links

      * installationid
      * id
      * follow
    
  */
  const links = (call, done) => {
    const req = call.request
  
    const linkQuery = {
      installationid: req.installationid,
      id: req.id
    }

    req.follow ?
      logic.linkTree(linkQuery, done) :
      logic.linkChildren(linkQuery, done)
    
  }


  /*
  
    create

      * installationid
      * parentid
      * data
    
  */
  const create = (call, done) => {
    const req = call.request
  
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
    
  }


  /*
  
    save

      * installationid
      * id
      * data
    
  */
  const save = (call, done) => {
    const req = call.request

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
    
  }



  /*
  
    delete

      * installationid
      * id
    
  */
  const del = (call, done) => {
    const req = call.request
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
    
  }


  /*
  
    paste

      * installationid
      * parentid
      * ids
      * mode
    
  */
  const paste = (call, done) => {
    const req = call.request
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
    
  }


  /*
  
    swap

      * installationid
      * source
      * target
      * mode
    
  */
  const swap = (call, done) => {
    const req = call.request
  
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
    
  }

  return {
    loadById,
    search,
    children,
    descendents,
    links,
    create,
    save,
    del,
    paste,
    swap
  }

}

module.exports = DiggerBackend