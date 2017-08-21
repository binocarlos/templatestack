'use strict'

const DEFAULT_OPTS = {
  tablename: 'useraccount'
}

const UserMigration = (opts = {}) => {

  opts = Object.assign({}, DEFAULT_OPTS, opts)

  const up = (knex, Promise) => {
   return Promise.all([
      knex.schema.createTable(opts.tablename, function(table) {
        table.specificType('id', 'serial primary key not null')
        table.specificType('created_at', 'timestamp default now()')
        table.string('username').unique().notNullable()
        table.string('hashed_password').notNullable()
        table.string('salt').notNullable()
        table.json('meta')
        table.string('mode')
      })
    ])
  }

  const down = (knex, Promise) => {
    return Promise.all([
      knex.schema.dropTable(opts.tablename)
    ])
  }

  return {
    up,
    down
  }
}

module.exports = UserMigration