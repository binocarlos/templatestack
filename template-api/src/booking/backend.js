'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const async = require('async')
const options = require('template-tools/src/utils/options')
const Range = require('template-tools/src/schedule/range')
 
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
  // a function to check if a slot has any space
  // return an error if the booking cannot be made
  checkBookingSlot: (booking, done) => done(),
  getSummary: booking => booking,
  getCalendarConfig: type => [],
  getScheduleConfig: type => {},
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

  const hooks = options.processor(opts.hooks, {
    required: REQUIRED_HOOKS
  })

  const storage = opts.storage
  const checkBookingSlot = opts.checkBookingSlot

  /*
  
    load

      * installationid
      * id
      * summary
    
  */
  const load = (call, done) => {
    const req = call.request
  
    storage.get({
      id: req.id,
      installationid: req.installationid
    }, (err, booking) => {
      if(err) return done(err)
      booking = req.summary ?
        opts.getSummary(booking) :
        booking
      done(null, booking)
    })

  }

  /*
  
    search

      * installationid
      * search
      * start
      * end
      * type
      * limit
      * summary
      
  */
  const search = (call, done) => {
    const req = call.request
  
    storage.search({
      installationid: req.installationid,
      search: req.search,
      start: req.start,
      end: req.end,
      type: req.type,
      limit: req.limit
    }, (err, bookings) => {
      if(err) return done(err)
      bookings = req.summary ?
        bookings.map(opts.getSummary) :
        bookings
      done(null, bookings)
    })
  }


  /*
  
    range

      * installationid
      * type
      * start
      * end
      * summary
    
  */
  const range = (call, done) => {
    const req = call.request
  
    const calendarConfig = opts.getCalendarConfig(req.type)
    const scheduleConfig = opts.getScheduleConfig(req.type)

    hemera.act({
      topic: TOPIC,
      cmd: 'search',
      installationid: req.installationid,
      start: req.start,
      end: req.end,
      type: req.type,
      summary: req.summary
    }, (err, bookings) => {
      if(err) return done(err)

      const results = Range({
        items: bookings,
        start: req.start,
        end: req.end,
        calendar: opts.getCalendarConfig(req.type),
        schedule: opts.getScheduleConfig(req.type),
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

      * installationid
      * data
        * name
        * date
        * type
        * slot
        * meta
    
  */
  const create = (call, done) => {
    const req = call.request
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
  }

  /*
  
    save

      * installationid
      * id
      * data
    
  */
  const save = (call, done) => {
    const req = call.request
  
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

  }


  /*
  
    del

    * id
    * installationid
    
  */
  const del = (call, done) => {
    const req = call.request
  
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