'use strict'

const NAMES = {
  booking: 'booking',
  installation: 'installation',
  bookingform: 'bookingform',
}

const up = (knex, Promise) => {
 return Promise.all([
    knex.schema.createTable(NAMES.booking, (table) => {
      table.specificType('id', 'serial primary key not null')
      table
        .integer(NAMES.installation)
        .references('id')
        .inTable(NAMES.installation)
        .onDelete('cascade')
      table
        .integer(NAMES.bookingform)
        .references('id')
        .inTable(NAMES.bookingform)
        .onDelete('cascade')
      table.specificType('created_at', 'timestamp default now()')
      table.string('type')
        .notNullable()
      table.string('booking_reference')
        .notNullable()
      table.date('date')
        .notNullable()
      table.string('slot')
        .notNullable()
      table.json('meta')
    }),
  ])
}

const down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable(NAMES.booking)
  ])
}

module.exports = {
  up,
  down
}