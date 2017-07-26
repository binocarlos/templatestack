'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const async = require('async')
const options = require('template-tools/src/utils/options')
const databaseTools = require('../database/tools')
const tools = require('./tools')

const SQL = require('./storage_sql_queries')

const REQUIRED = [
  
]

const DEFAULT_TABLES = {
  installation: 'installation',
  resource: 'resource',
  link: 'resource_link'
}

const DEFAULTS = {
  
}

const DiggerStorageSQL = (knex, opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const tables = options.processor(opts.tables, {
    defaults: DEFAULT_TABLES
  })

  const sqlQueries = SQL({ tables })


  // * installationid
  // * ids[]
  const loadLinks = (query, done) => {
    const { sql, params } = sqlQueries.links(query)
    knex
      .raw(sql, params)
      .asCallback(databaseTools.allExtractor(done))
  }

  // id
  const getResource = (id, done) => {
    return knex
      .select()
      .table(tables.resource)
      .where({
        id
      })
      .asCallback(databaseTools.singleExtractor(done))
  }


  // * installationid
  // * id
  // * type
  // * search
  const search = (query, done) => {
    const { sql, params } = sqlQueries.search(query)
    knex
      .raw(sql, params)
      .asCallback(databaseTools.allExtractor(done))
  }

  // * installationid
  // * id
  const children = (query, done) => {
    const { sql, params } = sqlQueries.children(query)
    knex
      .raw(sql, params)
      .asCallback(databaseTools.allExtractor(done))
  }

  // * installationid
  // * id
  // * type
  // * search
  const descendents = (query, done) => {
    const { sql, params } = sqlQueries.descendents(query)
    knex
      .raw(sql, params)
      .asCallback(databaseTools.allExtractor(done))
  }


  const insertResource = (trx, data, done) => {
    return knex
      .insert(data)
      .into(tables.resource)
      .returning('*')
      .transacting(trx)
      .asCallback(databaseTools.singleExtractor(done))
  }

  const saveResource = (trx, id, data, done) => {
    return knex(tables.resource)
      .where({id})
      .update(data)
      .returning('*')
      .transacting(trx)
      .asCallback(databaseTools.singleExtractor(done))
  }

  const createLinks = (trx, data, done) => {
    return knex
      .insert(data)
      .into(tables.link)
      .returning('*')
      .transacting(trx)
      .asCallback(databaseTools.allExtractor(done))
  }


  //   * id
  //   * installationid
  const del = (trx, query, done) => {
    knex(tables.resource)
      .where({
        id: query.id,
        installation: query.installationid
      })
      .del()
      .asCallback(databaseTools.singleExtractor(done))
  }

  //   * id
  //   * installationid
  const deleteLinks = (trx, id, done) => {
    knex(tables.link)
      .where({
        parent: id
      })
      .del()
      .asCallback(databaseTools.singleExtractor(done))
  }

  const transaction = (handler, done) => databaseTools.knexTransaction(knex, handler, done)

  return {
    loadLinks,
    getResource,
    search,
    children,
    descendents,
    insertResource,
    saveResource,
    createLinks,
    deleteLinks,
    del,
    transaction
  }
}

module.exports = DiggerStorageSQL