'use strict'

const NAMES = {
  installation: 'installation',
  bookingform: 'bookingform',
}

const up = (knex, Promise) => {
 return Promise.all([
    knex.schema.createTable(NAMES.bookingform, (table) => {
      table.specificType('id', 'serial primary key not null')
      table
        .integer(NAMES.installation)
        .references('id')
        .inTable(NAMES.installation)
        .onDelete('cascade')
      table.specificType('created_at', 'timestamp default now()')
      table.string('url')
        .notNullable()
      table.string('name')
        .notNullable()
      table.json('meta')
    }),
  ])
}

const down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable(NAMES.bookingform)
  ])
}

module.exports = {
  up,
  down
}