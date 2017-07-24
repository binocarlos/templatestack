"use strict";

const tape = require('tape')
const async = require('async')
const tools = require('./tools')
const authQueries = require('./queries/auth')
const queries = require('./queries/booking')
const fixtures = require('./fixtures/booking')

const dateTools = require('template-api/src/utils/date')

const Knex = require('../src/databases/knex')
const Transport = require('../src/transport')

const knex = Knex()
const transport = Transport()

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
    if(err) {
      t.error(err)
      t.end()
      return
    }
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

tape('booking - search start', (t) => {

  const userData = authQueries.UserData()
  const MAX = 10
  const YEAR = 2017
  const MONTH = 7

  const SEARCH_START = 6
  let overlays = []
  let count = 0

  while(count<MAX) {
    overlays.push({
      date: new Date(YEAR, MONTH, count+1)
    })
    count++
  }

  createFixtureBookings(userData, overlays, {}, (err, base) => {
    if(err) {
      t.error(err)
      t.end()
      return
    }
    queries.search(base.i, {
      start: dateTools.sqlDate(new Date(YEAR, MONTH, SEARCH_START), true)
    }, (err, result) => {
      if(err) t.error(err)

      const bookings = result.body
      t.equal(result.statusCode, 200, '200 code')

      t.equal(bookings.length, MAX - SEARCH_START + 1, 'correct count')

      const firstBooking = bookings[0]
      const firstBookingDate = new Date(firstBooking.date)

      t.equal(firstBookingDate.getDate(), SEARCH_START, 'first booking date is correct')
      t.end()
    })
    
  })
})

tape('booking - search start & end / range', (t) => {

  const userData = authQueries.UserData()
  const MAX = 10
  const YEAR = 2017
  const MONTH = 7

  const SEARCH_START = 6
  const SEARCH_END = 9
  let overlays = []
  let count = 0

  while(count<MAX) {
    overlays.push({
      date: new Date(YEAR, MONTH, count+1)
    })
    count++
  }

  createFixtureBookings(userData, overlays, {}, (err, base) => {
    if(err) {
      t.error(err)
      t.end()
      return
    }
    queries.search(base.i, {
      start: dateTools.sqlDate(new Date(YEAR, MONTH, SEARCH_START), true),
      end: dateTools.sqlDate(new Date(YEAR, MONTH, SEARCH_END), true)
    }, (err, result) => {
      if(err) t.error(err)

      const bookings = result.body
      t.equal(result.statusCode, 200, '200 code')

      t.equal(bookings.length, SEARCH_END - SEARCH_START + 1, 'correct count')

      t.end()
    })
    
  })
})

tape('booking - search start & end same date', (t) => {

  const userData = authQueries.UserData()
  const MAX = 10
  const YEAR = 2017
  const MONTH = 7

  const SEARCH_START = 6
  
  let overlays = []
  let count = 0

  while(count<MAX) {
    overlays.push({
      date: new Date(YEAR, MONTH, count+1)
    })
    count++
  }

  const dateString = dateTools.sqlDate(new Date(YEAR, MONTH, SEARCH_START), true)

  createFixtureBookings(userData, overlays, {}, (err, base) => {
    if(err) {
      t.error(err)
      t.end()
      return
    }
    queries.search(base.i, {
      start: dateString,
      end: dateString
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

tape('booking - search meta', (t) => {

  const userData = authQueries.UserData()
  let overlays = [{
    name: 'person1'
  },{
    name: 'person2'
  },{
    email: 'person1@test.com'
  }]
  
  createFixtureBookings(userData, overlays, {}, (err, base) => {
    if(err) {
      t.error(err)
      t.end()
      return
    }
    queries.search(base.i, {
      search: 'person1'
    }, (err, result) => {
      if(err) t.error(err)

      const bookings = result.body

      t.equal(result.statusCode, 200, '200 code')

      t.equal(bookings.length, 2, 'correct count')

      t.equal(bookings[0].meta.info.name, 'person1', 'name = person1')
      t.equal(bookings[1].meta.info.email, 'person1@test.com', 'email = person1')

      t.end()
    })
    
  })
})

tape('booking - create', (t) => {

  const userData = authQueries.UserData()
  let overlays = [{
    name: 'person1'
  }]

  let user = null
  let i = null

  const data = fixtures.createMany(overlays, {})[0]

  async.waterfall([
    (next) => authQueries.register(userData, next),

    (u, next) => {
      user = u.body      
      i = user.meta.activeInstallation
      transport.act({
        topic: 'booking',
        cmd: 'create',
        installationid: i,
        data
      }, next)
    }
  ], (err, result) => {
    if(err) t.error(err)

    t.equal(result.installation, i, 'installation ok')
    t.equal(result.meta.info.name, 'person1', 'name ok')
    
    t.end()
  })

})


tape('close database', (t) => {
  
  knex.destroy()
    .then(() => {
      transport.close()
      t.end()
    })
})