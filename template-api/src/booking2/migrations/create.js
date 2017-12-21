'use strict'

const DEFAULT_OPTS = {
  userTablename: 'useraccount',
  bookingTablename: 'booking',
}

const BookingMigration = (opts = {}) => {
  opts = Object.assign({}, DEFAULT_OPTS, opts)

  const up = (knex, Promise) => {
   return Promise.all([
      knex.schema.createTable(opts.bookingTablename, (table) => {
        table.specificType('id', 'serial primary key not null')
        table
          .integer(opts.userTablename)
          .references('id')
          .inTable(opts.userTablename)
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
      knex.schema.dropTable(opts.bookingTablename)
    ])
  }

  return {
    up,
    down
  }
}

module.exports = BookingMigration