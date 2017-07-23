'use strict'

const DEFAULT_OPTS = {
  installationTablename: 'installation',
  paymentTablename: 'payment'
}

const PaymentMigration = (opts = {}) => {
  opts = Object.assign({}, DEFAULT_OPTS, opts)

  const up = (knex, Promise) => {
   return Promise.all([
      knex.schema.createTable(opts.paymentTablename, (table) => {
        table.increments('id')
          .primary()
        if(opts.installationTablename) {
          table.integer(opts.installationTablename)
            .references('id')
            .inTable(opts.installationTablename)
            .onDelete('cascade')
        }
        table.string('name')
          .notNullable()
        table.specificType('date', 'timestamp without time zone not null'),
        table.string('provider')
          .notNullable()
        table.string('reference')
          .notNullable()
        table.float('amount')
          .notNullable()
        table.json('meta')
      })
    ])
  }

  const down = (knex, Promise) => {
    return Promise.all([
      knex.schema.dropTable(opts.paymentTablename)
    ])
  }

  return {
    up,
    down
  }
}

module.exports = PaymentMigration