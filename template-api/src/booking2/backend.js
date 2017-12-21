'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const async = require('async')
const options = require('template-tools/src/utils/options')
const Range = require('template-tools/src/schedule/range')
 
const databaseTools = require('../database/tools')

const REQUIRED = [
  'knex',
]

const DEFAULTS = {
  processSlot: slot => slot
}

/*

  user namespace
  
*/
const BookingBackend = (opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const knex = opts.knex

  const transaction = (handler, done) => databaseTools.knexTransaction(knex, handler, done)

  /*
  
    load

      * userid
      * id
      * summary
    
  */
  const load = (call, done) => {
    const req = call.request
  
    knex.select('*')
      .from('booking')
      .where({
        id: req.id,
        useraccount: req.userid
      })
      .asCallback(databaseTools.singleExtractor((err, booking) => {
        if(err) return done(err)
        booking = req.summary ?
          opts.getSummary(booking) :
          booking
        done(null, booking)
      }))
  }


  /*
  
    searchQuery

    * userid
    * search
    * start
    * end
    * type
    * limit
    
  */
  const searchQuery = (query) => {
    let parts = ['useraccount = ?']
    let params = [query.userid]
    
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
  booking
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

  /*
  
    search

      * userid
      * search
      * start
      * end
      * type
      * limit
      * summary
      
  */
  const search = (call, done) => {
    const req = call.request

    const queryParams = {
      userid: req.userid,
      search: req.search,
      start: req.start,
      end: req.end,
      type: req.type,
      limit: req.limit
    }

    const { sql, params } = searchQuery(queryParams)

    knex
      .raw(sql, params)
      .asCallback(databaseTools.allExtractor((err, bookings) => {
        if(err) return done(err)
        bookings = req.summary ?
          bookings.map(opts.getSummary) :
          bookings
        done(null, bookings)
      }))
  }


  /*
  
    range

      * userid
      * calendar
      * schedule
      * type
      * start
      * end
      * summary
    
  */
  const range = (call, done) => {
    const req = call.request
  
    search({
      request: {
        userid: req.userid,
        start: req.start,
        end: req.end,
        type: req.type,
        summary: req.summary
      }
    }, (err, bookings) => {
      if(err) return done(err)

      const results = Range({
        items: bookings,
        start: req.start,
        end: req.end,
        calendar: req.calendar,
        schedule: req.schedule,
        mergeSlot: {
          type: req.type
        },
        mergeSchedule: {
          type: req.type
        },
        mergeDay: {
          type: req.type
        },
        processSlot: opts.processSlot
      })

      done(null, results)
    })
  }

  /*
  
    create

    it is assumed that (in this order):

    * space for the booking has been checked
    * the payment is taken and written to the payment table

    fields:

      * userid
      * data
        * name
        * date
        * type
        * slot
        * meta
    
  */
  const create = (call, done) => {
    const req = call.request
    transaction((trx, finish) => {

      const insertData = Object.assign({}, query.data, {
        useraccount: query.userid
      })

      knex('booking')
        .insert(insertData)
        .transacting(trx)
        .returning('*')
        .asCallback(databaseTools.singleExtractor(finish))

    }, done)
  }

  /*
  
    save

      * userid
      * id
      * data
    
  */
  const save = (call, done) => {
    const req = call.request
  
    transaction((trx, finish) => {

      knex('booking')
        .where({
          id: req.id,
          useraccount: req.userid
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
    * userid
    
  */
  const del = (call, done) => {
    const req = call.request
  
    transaction((trx, finish) => {

      knex('booking')
        .where({
          id: req.id,
          useraccount: req.userid
        })
        .del()
        .transacting(trx)
        .returning('*')
        .asCallback(databaseTools.singleExtractor(done))

    }, done)

  }

  return {
    load,
    search,
    range,
    create,
    save,
    del
  }

}

module.exports = BookingBackend