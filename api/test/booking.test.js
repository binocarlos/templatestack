"use strict";

const tape = require('tape')
const async = require('async')
const tools = require('./tools')
const authQueries = require('./queries/auth')
const queries = require('./queries/booking')
const fixtures = require('./fixtures/booking')

const dateTools = require('template-api/src/utils/date')

const Databases = require('../src/databases')

const databases = Databases()

const knex = databases.knex

const createFixtureBookings = (userData, overlays, bookingOpts, done) => {
  async.waterfall([
    (next) => authQueries.register(userData, next),

    (user, next) => {
      user = user.body      
      const i = user.meta.activeInstallation

      overlays = overlays.map(overlay => {
        return Object.assign({}, overlay, {
          installation: i
        })
      })

      const data = fixtures.createMany(overlays, bookingOpts)

      knex('booking')
        .insert(data)
        .returning('*')
        .asCallback((err, results) => {
          if(err) return done(err)
          done(null, {
            bookings: results,
            user,
            i
          })
        })
    }
  ], done)
}


tape('booking - search all', (t) => {

  const userData = authQueries.UserData()
  const MAX = 10
  let overlays = []
  let count = 0

  while(count<MAX) {
    overlays.push({
      date: new Date(2017, 7, count+1)
    })
    count++
  }

  createFixtureBookings(userData, overlays, {}, (err, base) => {

    queries.search(base.i, {}, (err, result) => {
      if(err) t.error(err)

      const bookings = result.body
      t.equal(result.statusCode, 200, '200 code')
      t.equal(bookings.length, overlays.length, 'correct count')

      const bookingDates = bookings.map(booking => dateTools.sqlDate(booking.date, true))
      const overlayDates = overlays.map(overlay => dateTools.sqlDate(overlay.date, true))

      t.deepEqual(bookingDates, overlayDates, 'dates are equal')

      t.end()
    })
    
  })
})

tape('close database', (t) => {
  t.end()
  process.exit()
})