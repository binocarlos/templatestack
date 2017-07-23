'use strict'

const DEFAULT_OPTS = {
  installationTablename: 'installation',
  bookingTablename: 'booking',
  paymentLinkTablename: 'booking_payment',
  paymentTablename: 'payment'
}

const BookingMigration = (opts = {}) => {
  opts = Object.assign({}, DEFAULT_OPTS, opts)

  const up = (knex, Promise) => {
   return Promise.all([
      knex.schema.createTable(opts.bookingTablename, (table) => {
        table.increments('id')
          .primary()
        if(opts.installationTablename) {
          table.integer(opts.installationTablename)
            .references('id')
            .inTable(opts.installationTablename)
            .onDelete('cascade')
        }
        table.date('date')
          .notNullable()
        table.string('type')
          .notNullable()
        table.string('booking_reference')
          .notNullable()
        table.string('slot')
          .notNullable()
        table.json('meta')
      })
    ])
  }

  const down = (knex, Promise) => {
    return Promise.all([
      knex.schema.dropTable(opts.paymentLinkTablename),
      knex.schema.dropTable(opts.bookingTablename)
    ])
  }

  return {
    up,
    down
  }
}

module.exports = BookingMigration