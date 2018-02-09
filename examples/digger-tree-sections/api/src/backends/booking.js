'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const async = require('async')
const options = require('template-tools/src/utils/options')
const Range = require('template-tools/src/schedule/range')
const selectors = require('template-tools/src/booking/selectors')
const idTools = require('template-tools/src/utils/id')
const dateTools = require('template-tools/src/utils/date')

const databaseTools = require('template-api/src/database/tools')

const REQUIRED = [
  'knex',
  'getClients',
  //'getCalendar', // (type, installationid, done) => {}
  //'getSchedule', // (type, installationid, done) => {}
  //'validateBookingOptions', // (booking) => {}
  //'canBookSlot', // (booking, slot) => {}
  //'sendCommunications', // (booking, opts, done) => {}
  //'processPayment', // (booking, customerEmail, done) => {}
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

  const {
    knex,
    getClients,
  } = opts
  
  /*
  
    --------------------------------------------

    HELPERS

    --------------------------------------------
    
  */
  

  const transaction = (handler, done) => databaseTools.knexTransaction(knex, handler, done)

  const isSlotBlocked = (slot) => selectors.slot.isBlocked(slot)
  const isSlotEmpty = (slot) => selectors.slot.isEmpty(slot)

  const loadSlot = (installationid, booking, done) => {
    range({
      request:{
        installationid,
        type: booking.type,
        start: booking.date,
        end: booking.date
      }
    }, (err, days) => {
      if(err) return done(err)
      const day = days[0]
      if(!day) return done(new Error('no day found'))
      const slot = selectors.day.slot(day, booking.slot)
      done(null, slot)
    })
  }

  /*
  
    searchQuery

    * installationid
    * search
    * start
    * end
    * type
    * limit
    
  */
  const searchQuery = (query) => {
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
  
    --------------------------------------------

    QUERIES

    --------------------------------------------
    
  */

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

    const queryParams = {
      installationid: req.installationid,
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
        bookings = req.summary && opts.getSummary ?
          bookings.map(opts.getSummary) :
          bookings
        done(null, bookings)
      }))
  }

  /*
  
    check

      * installationid
      * ctx
      * data
        * date
        * type
        * slot
        * meta
    
  */
  const check = (call, done) => {
    const req = call.request
    const booking = req.data

    // TODO: use the drivers to validate
    const errors = validateBookingOptions(booking)
    if(errors) return done(null, errors)

    loadSlot(req.installationid, booking, (err, slot) => {
      if(err) return done(err)
      if(!canBookSlot(booking, slot)) {
        return done(null, {
          ok: false,
          error: 'there is no space left for this booking'
        })
      }
      const returnSlot = Object.assign({}, slot)
      delete(returnSlot._items)
      done(null, {
        ok: true,
        slot: returnSlot
      })
    })
  }


  /*
  
    slot

      * installationid
      * date
      * slot
      * type
      
    
  */
  const slot = (call, done) => {
    const req = call.request
    const booking = req.data

    loadSlot(req.installationid, req, (err, slot) => {
      if(err) return done(err)
      done(null, {
        ok: true,
        slot
      })
    })
  }

  const getBookingForm = (type, installationid, done) => {
    const clients = getClients()
    clients.digger.search({
      installationid,
      type: 'bookingForm',
      namespace: 'bookingForm',
    }, (err, bookingForms) => {
      if(err) return done(err)
      const bookingForm = (bookingForms || []).filter(b => b.meta.url == type)[0]
      done(null, bookingForm)
    })
  }

  const getCalendar = (type, installationid, done) => {
    async.waterfall([
      (next) => getBookingForm(type, installationid, next),
      (bookingForm, next) => {
        console.log('-------------------------------------------');
        console.log('-------------------------------------------');
        console.dir('calendar')
        console.dir(bookingForm)
        next(null, [])
      }
    ], done)
  }

  const getSchedule = (type, installationid, done) => {
    done(null, [])
  }

  /*
  
    range

      * installationid
      * calendar
      * schedule
      * type
      * start
      * end
      * summary
    
  */
  const range = (call, done) => {
    const req = call.request

    const start = req.start || '2018-02-02'
    const end = req.start || '2018-02-08'

    async.parallel({
      bookings: next => {
        search({
          request: {
            installationid: req.installationid,
            start: req.start,
            end: req.end,
            type: req.type,
            summary: req.summary
          }
        }, next)
      },
      calendar: next => getCalendar(req.type, req.installationid, next),
      schedule: next => getSchedule(req.type, req.installationid, next),
    }, (err, data) => {
      if(err) return done(err)

      const results = Range({
        items: data.bookings,
        start,
        end,
        calendar: data.calendar,
        schedule: data.schedule,
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
  
    --------------------------------------------

    COMMANDS

    --------------------------------------------
    
  */

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
  const _create = (call, done) => {
    const req = call.request
    transaction((trx, finish) => {

      const insertData = Object.assign({}, req.data, {
        installation: req.installationid
      })

      knex('booking')
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
  const _save = (call, done) => {
    const req = call.request
  
    transaction((trx, finish) => {

      knex('booking')
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

      knex('booking')
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


  /*
  
    block

      * installationid
      * data
          * date
          * type
          * slot
    
  */
  const block = (call, done) => {
    const req = call.request
    const booking = req.data
    let context = {}

    async.series([

      // check that the slot is open - we cannot block a booked slot
      (next) => {
        loadSlot(req.installationid, booking, (err, slot) => {
          if(err) return next(err)
          if(!isSlotEmpty(slot)) {
            return done(null, {
              ok: false,
              error: 'you cannot block a slot that has an existing booking'
            })
          }
          context.slot = slot
          next()
        })
      },

      (next) => {

        const blockedBooking = selectors.booking.getBlockedBooking(booking, context.slot)
        create({
          request: {
            installationid: req.installationid,
            data: blockedBooking  
          }
        }, (err, result) => {
          if(err) return next(err)
          if(!result) return next('no booking created')
          context.booking = result
          next()
        })
      }

    ], err => {
      if(err) return done(err)
      done(null, {
        ok: true,
        booking: context.booking
      })
    })
  }


  /*
  
    unblock

      * installationid
      * data
          * date
          * type
          * slot
    
  */
  const unblock = (call, done) => {
    const req = call.request
    const booking = req.data
    let context = {}

    booking.date = dateTools.sqlDate(booking.date, true)

    async.series([

      // check that the slot is open - we cannot block a booked slot
      (next) => {
        loadSlot(req.installationid, booking, (err, slot) => {
          if(err) return next(err)
          if(isSlotEmpty(slot)) {
            return done(null, {
              ok: false,
              error: 'you cannot unblock an empty slot'
            })
          }
          if(!isSlotBlocked(slot)) {
            return done(null, {
              ok: false,
              error: 'you cannot unblock an non blocked slot'
            })
          }
          context.slot = slot
          context.booking = selectors.slot.blockedBookings(slot)[0]
          next()
        })
      },

      (next) => {
        del({
          request: {
            installationid: req.installationid,
            id: context.booking.id
          }
        }, (err) => {
          if(err) return next(err)
          next()
        })
      }

    ], err => {
      if(err) return done(err)
      done(null, {
        ok: true
      })
    })
  }

  /*
  
    submit

      * installationid
      * data
        * date
        * type
        * slot
        * meta
    
  */
  const submit = (call, done) => {
    const req = call.request
    let context = {}

    const booking = req.data
    booking.booking_reference = idTools.makeid()

    const info = selectors.booking.info(booking)

    const customerEmail = info.email
    const customerPhone = info.mobile

    async.series([

      // this injects the slot from the database to prevent
      // a false slot being submitted by the client being used
      (next) => {
        check({
          request: req
        }, (err, result) => {
          if(err) return done(err)
          if(!result.ok) return done(null, result)
          let slot = result.slot

          // important otherwise we write recursive data into our database
          delete(slot._items)
          booking.meta.slot = slot
          next()
        })
      },

      (next) => processPayment(booking, customerEmail, next),

      (next) => {
        _create({
          request: {
            installationid: req.installationid,
            data: booking
          }
        }, (err, result) => {
          if(err) return next(err)
          if(!result) return next('no booking created')
          context.booking = result
          next()
        })
      },

      (next) => {
        sendCommunications(booking, {
          email: true,
          sms: true
        }, (err, results) => {
          if(err) return next(err)
          context.comResults = results
          next()
        })
      }

    ], err => {
      if(err) return done(err)
      done(null, {
        ok: true,
        result: {
          booking: context.booking,
          email: context.comResults.email,
          sms: context.comResults.sms
        }
      })
    })
  }


  /*
  
    create - admin

      * installationid
      * data
        * communication
          * sms
          * email
        * booking
          * date
          * type
          * slot
          * meta
    
  */
  const create = (call, done) => {
    const req = call.request
    let context = {}

    const { booking, communication } = req.data
    const { sms, email } = communication

    booking.booking_reference = idTools.makeid()

    const info = selectors.booking.info(booking)

    const customerEmail = info.email
    const customerPhone = info.mobile

    async.series([

      (next) => {
        check({
          request: {
            installationid: req.installationid,
            data: booking
          }
        }, (err, result) => {
          if(err) return done(err)
          if(!result.ok) return done(null, result)
          let slot = result.slot
          delete(slot._items)
          booking.meta.slot = slot
          next()
        })
      },

      (next) => {
        _create({
          installationid: req.installationid,
          data: booking
        }, (err, result) => {
          if(err) return next(err)
          if(!result) return next('no booking created')
          context.booking = result
          next()
        })
      },

      (next) => {
        sendCommunications(booking, {
          email,
          sms
        }, (err, results) => {
          if(err) return next(err)
          context.comResults = results
          next()
        })
      }

    ], err => {
      if(err) return done(err)
      done(null, {
        ok: true,
        result: {
          booking: context.booking,
          email: context.comResults.email,
          sms: context.comResults.sms
        }
      })
    })
  }


  /*
  
    save - admin

      * installationid
      * id
      * data
        * communication
          * sms
          * email
        * booking
          * date
          * type
          * slot
          * meta
    
  */
  const save = (call, done) => {
    const req = call.request

    let context = {}

    const id = req.id
    const { booking, communication } = req.data
    const { sms, email } = communication

    const info = selectors.booking.info(booking)

    const customerEmail = info.email
    const customerPhone = info.mobile

    delete(booking.meta.slot._items)

    async.series([

      (next) => {
        load({
          request: {
            installationid: req.installationid,
            id  
          }
        }, (err, result) => {
          if(err) return next(err)
          if(!result) return next('no booking found')
          next()
        })
      },

      (next) => {
        _save({
          request: {
            installationid: req.installationid,
            id: booking.id,
            data: booking
          }
        }, (err, result) => {
          if(err) return next(err)
          if(!result) return next('no booking saved')
          context.booking = result
          next()
        })
      },

      (next) => {
        sendCommunications(booking, {
          email,
          sms
        }, (err, results) => {
          if(err) return next(err)
          context.comResults = results
          next()
        })
      }

    ], err => {
      if(err) return done(err)
      done(null, {
        ok: true,
        result: {
          booking: context.booking,
          email: context.comResults.email,
          sms: context.comResults.sms
        }
      })
    })
  }

  return {
    search,
    range,
    create,
    _create,
    save,
    _save,
    del,
    check,
    block,
    slot,
    unblock,
    submit,
  }

}

module.exports = BookingBackend