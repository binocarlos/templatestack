"use strict";

const tape = require('tape')
const async = require('async')
const BookingTests = require('template-api/src/test/booking.test.js')

const Knex = require('../src/databases/knex')

const knex = Knex({
  debug: false
})

const authQueries = BookingTests.queries.auth

BookingTests({
  knex
})
