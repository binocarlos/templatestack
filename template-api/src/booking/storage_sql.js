'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const async = require('async')
const options = require('template-tools/src/utils/options')
const databaseTools = require('../database/tools')

const SQL = require('./storage_sql_queries')

const REQUIRED = [
  'knex'
]

const DEFAULT_TABLES = {
  installation: 'installation',
  booking: 'booking'
}

const DEFAULTS = {
  
}

const BookingStorageSQL = (opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const knex = opts.knex
  const tables = options.processor(opts.tables, {
    defaults: DEFAULT_TABLES
  })

  const searchPaths = opts.searchPaths
  const sqlQueries = SQL({ tables })

  /*
  
    search

    * installationid
    * search
    * start
    * end
    * type
    
  */
  const search = (query, done) => {
    const { sql, params } = sqlQueries.search(query)
    knex
      .raw(sql, params)
      .asCallback(databaseTools.allExtractor(done))
  }

  /*
  
    load

    * id
    
  */
  const load = (query, done) => {
    knex.select('*')
      .from(tables.booking)
      .where({
        id: query.id,
        [tables.installation]: query.installationid
      })
      .asCallback(databaseTools.singleExtractor(done))
  }

  /*
  
    create

    * installationid
    * data
      * name
      * date
      * type
      * slot
      * meta
    
  */
  const create = (trx, query, done) => {
    const insertData = Object.assign({}, query.data, {
      installation: query.installationid
    })
    knex('booking')
      .insert(insertData)
      .transacting(trx)
      .returning('*')
      .asCallback(databaseTools.singleExtractor(done))
  }


  /*
  
    save

    * id
    * data
    
  */
  const save = (trx, query, done) => {
    knex(tables.booking)
      .where({
        id: query.id,
        [tables.installation]: query.installationid
      })
      .update(data)
      .transacting(trx)
      .returning('*')
      .asCallback(databaseTools.singleExtractor(done))
  }

  /*
  
    del

    * id
    
  */
  const del = (trx, query, done) => {
    knex(tables.booking)
      .where({
        id: query.id,
        [tables.installation]: query.installationid
      })
      .del(data)
      .transacting(trx)
      .returning('*')
      .asCallback(databaseTools.singleExtractor(done))
  }


  const transaction = (handler, done) => databaseTools.knexTransaction(knex, handler, done)
  
  return {
    search,
    create,
    load,
    save,
    del,
    transaction
  }
}

module.exports = BookingStorageSQL