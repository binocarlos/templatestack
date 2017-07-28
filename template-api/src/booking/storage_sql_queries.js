'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const async = require('async')
const options = require('template-tools/src/utils/options')
const tools = require('../database/tools')

const REQUIRED = [
  'tables'
]

const DEFAULTS = {
  search_paths: [
    `booking.meta#>>'{info,name}'`,
    `booking.meta#>>'{info,secondary_name}'`,
    `booking.meta#>>'{info,email}'`,
    `booking.meta#>>'{info,mobile}'`,
    `booking_reference`
  ]
}

const BookingSQL = (opts = {}) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const tables = opts.tables
  const searchPaths = opts.search_paths

  /*
  
    search

    * installationid
    * search
    * start
    * end
    * type
    * limit
    
  */
  const search = (query) => {
    let parts = ['installation = ?']
    let params = [query.installationid]
    
    if(query.search) {
      let searchParts = []
      searchPaths.forEach(path => {
        searchParts.push(`${path} ILIKE ?`)
        params.push(`%${query.search}%`)
      })
      parts.push(`( ${searchParts.join(' or ')} )`)
    }

    if(query.start) {
      parts.push(`booking.date::text >= ?`)
      params.push(query.start)
    }

    if(query.end) {
      parts.push(`booking.date::text <= ?`)
      params.push(query.end)
    }

    if(query.type) {
      parts.push(`type = ?`)
      params.push(query.type)
    }

    let limit = ''

    if(query.limit) {
      limit = 'limit ?'
      params.push(query.limit)
    }
    
    const clause = parts.join("\nand\n")

    const sql = `select *
from
  ${tables.booking}
where
${clause}
order by
  date ASC
${limit}
`

    const ret = {
      sql,
      params
    }

    return ret
  }


  return {
    search
  }

}

module.exports = BookingSQL