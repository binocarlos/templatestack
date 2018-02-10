'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const async = require('async')
const options = require('template-tools/src/utils/options')
const Range = require('template-tools/src/schedule/range')
const selectors = require('template-tools/src/booking/selectors')
const idTools = require('template-tools/src/utils/id')
const dateTools = require('template-tools/src/utils/date')

const databaseTools = require('../database/tools')

const REQUIRED = [
  'knex',
  'tablename',
]

const DEFAULTS = {
  processSlot: slot => slot
}

/*

  user namespace
  
*/
const CrudBackend = (opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const {
    knex,
    tablename,
  } = opts
  
  /*
  
    --------------------------------------------

    HELPERS

    --------------------------------------------
    
  */
  

  const transaction = (handler, done) => databaseTools.knexTransaction(knex, handler, done)

  /*
  
    --------------------------------------------

    QUERIES

    --------------------------------------------
    
  */
  

  /*
  
    list

      * installationid
    
  */
  const list = (call, done) => {
    const req = call.request
    knex.select('*')
      .from(tablename)
      .where({        
        installation: req.installationid
      })
      .asCallback(databaseTools.allExtractor(done))
  }

  /*
  
    get

      * installationid
      * id
    
  */
  const get = (call, done) => {    
    const req = call.request
    knex.select('*')
      .from(tablename)
      .where({        
        installation: req.installationid,
        id: req.id,
      })
      .asCallback(databaseTools.singleExtractor(done))
  }

  /*
  
    --------------------------------------------

    COMMANDS

    --------------------------------------------
    
  */

  /*
  
      * installationid
      * data
    
  */
  const create = (call, done) => {
    const req = call.request

    transaction((trx, finish) => {

      const insertData = Object.assign({}, req.data, {
        installation: req.installationid
      })

      knex(tablename)
        .insert(insertData)
        .transacting(trx)
        .returning('*')
        .asCallback(databaseTools.singleExtractor(finish))

    }, done)
  }

  /*
  
    update

      * installationid
      * id
      * data
    
  */
  const save = (call, done) => {
    const req = call.request
  
    transaction((trx, finish) => {

      knex(tablename)
        .where({
          id: req.id,
          installation: req.installationid
        })
        .update(req.data)
        .transacting(trx)
        .returning('*')
        .asCallback(databaseTools.singleExtractor(finish))

    }, done)

  }


  /*
  
    del

    * id
    * installationid
    
  */
  const del = (call, done) => {
    const req = call.request
  
    transaction((trx, finish) => {

      knex(tablename)
        .where({
          id: req.id,
          installation: req.installationid
        })
        .del()
        .transacting(trx)
        .returning('*')
        .asCallback(databaseTools.singleExtractor(finish))

    }, done)

  }

  return {
    list,
    get,
    create,
    save,
    del,
  }

}

module.exports = CrudBackend