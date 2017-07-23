'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const async = require('async')
const options = require('../utils/options')
const databaseTools = require('../database/tools')

const SQL = require('./storage_sql_queries')

const REQUIRED = [
  
]

const DEFAULT_TABLES = {
  installation: 'installation',
  booking: 'booking'
}

const DEFAULTS = {
  
}

const BookingStorageSQL = (knex, opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const tables = options.processor(opts.tables, {
    defaults: DEFAULT_TABLES
  })

  const searchPaths = opts.searchPaths
  const sqlQueries = SQL({ tables })

  /*
  
    search

    * installationid
    * search
    * from
    * to
    * type
    
  */
  const search = (query, done) => {
    const { sql, params } = sqlQueries.search(query)
    knex
      .raw(sql, params)
      .asCallback(databaseTools.allExtractor(done))
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
    console.log('-------------------------------------------');
    console.dir(query)
    const insertData = Object.assign({}, query.data, {
      installation: query.installationid
    })

    console.log('-------------------------------------------');
    console.log('-------------------------------------------');
    console.dir(insertData)
    knex('booking')
      .insert(insertData)
      .transacting(trx)
      .returning('*')
      .asCallback(databaseTools.singleExtractor(done))
  }

  const transaction = (handler, done) => databaseTools.knexTransaction(knex, handler, done)
  
  return {
    search,
    create,
    transaction
  }
}

module.exports = BookingStorageSQL