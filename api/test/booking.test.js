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

const getFixtureData = (i, overlays, bookingOpts) => {
  overlays = overlays.map(overlay => {
    return Object.assign({}, overlay, {
      installation: i
    })
  })

  return fixtures.createMany(overlays, bookingOpts)
}

const createFixtureBookings = (userData, overlays, bookingOpts, done) => {
  async.waterfall([
    (next) => authQueries.register(userData, next),

    (user, next) => {
      user = user.body      
      const i = user.meta.activeInstallation
      const data = getFixtureData(i, overlays, bookingOpts)
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
  const YEAR = 2017
  const MONTH = 7
  let overlays = []
  let count = 0

  while(count<MAX) {
    overlays.push({
      date: new Date(YEAR, MONTH, count+1)
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

tape('booking - search from', (t) => {

  const userData = authQueries.UserData()
  const MAX = 10
  const YEAR = 2017
  const MONTH = 7

  const SEARCH_FROM = 6
  let overlays = []
  let count = 0

  while(count<MAX) {
    overlays.push({
      date: new Date(YEAR, MONTH, count+1)
    })
    count++
  }

  createFixtureBookings(userData, overlays, {}, (err, base) => {

    queries.search(base.i, {
      from: dateTools.sqlDate(new Date(YEAR, MONTH, SEARCH_FROM), true)
    }, (err, result) => {
      if(err) t.error(err)

      const bookings = result.body
      t.equal(result.statusCode, 200, '200 code')

      t.equal(bookings.length, MAX - SEARCH_FROM + 1, 'correct count')

      const firstBooking = bookings[0]
      const firstBookingDate = new Date(firstBooking.date)

      t.equal(firstBookingDate.getDate(), SEARCH_FROM, 'first booking date is correct')
      t.end()
    })
    
  })
})

tape('booking - search from & to / range', (t) => {

  const userData = authQueries.UserData()
  const MAX = 10
  const YEAR = 2017
  const MONTH = 7

  const SEARCH_FROM = 6
  const SEARCH_TO = 9
  let overlays = []
  let count = 0

  while(count<MAX) {
    overlays.push({
      date: new Date(YEAR, MONTH, count+1)
    })
    count++
  }

  createFixtureBookings(userData, overlays, {}, (err, base) => {

    queries.search(base.i, {
      from: dateTools.sqlDate(new Date(YEAR, MONTH, SEARCH_FROM), true),
      to: dateTools.sqlDate(new Date(YEAR, MONTH, SEARCH_TO), true)
    }, (err, result) => {
      if(err) t.error(err)

      const bookings = result.body
      t.equal(result.statusCode, 200, '200 code')

      t.equal(bookings.length, SEARCH_TO - SEARCH_FROM + 1, 'correct count')

      t.end()
    })
    
  })
})

tape('booking - search from & to / range', (t) => {

  const userData = authQueries.UserData()
  const MAX = 10
  const YEAR = 2017
  const MONTH = 7

  const SEARCH_FROM = 6
  
  let overlays = []
  let count = 0

  while(count<MAX) {
    overlays.push({
      date: new Date(YEAR, MONTH, count+1)
    })
    count++
  }

  const dateString = dateTools.sqlDate(new Date(YEAR, MONTH, SEARCH_FROM), true)

  createFixtureBookings(userData, overlays, {}, (err, base) => {

    queries.search(base.i, {
      from: dateString,
      to: dateString
    }, (err, result) => {
      if(err) t.error(err)

      const bookings = result.body
      t.equal(result.statusCode, 200, '200 code')

      t.equal(bookings.length, 1, 'correct count')
      t.equal(dateTools.sqlDate(bookings[0].date, true), dateString, 'dates are equal')

      t.end()
    })
    
  })
})

tape('close database', (t) => {
  t.end()
  process.exit()
})