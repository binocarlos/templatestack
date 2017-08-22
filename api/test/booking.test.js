"use strict";

const tape = require('tape')
const async = require('async')
const BookingTests = require('template-api/src/test/booking.test.js')

const Knex = require('../src/databases/knex')

const knex = Knex()

const authQueries = BookingTests.queries.auth

BookingTests({
  knex,
  noInstallation: true,
  createAccount: (done) => {
    authQueries.login({
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD
    }, (err, result) => {
      if(err) return done(err)
      result.body.meta = {
        activeInstallation: 1
      }
      done(null, result)
    })
  }
})
