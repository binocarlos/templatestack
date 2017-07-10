'use strict'

const DEFAULT_OPTS = {
  tablename: 'useraccount'
}

const UserMigration = (opts = {}) => {

  opts = Object.assign({}, DEFAULT_OPTS, opts)

  const up = (knex, Promise) => {
   return Promise.all([
      knex.schema.createTable(opts.tablename, function(table) {
        table.increments('id').primary()
        table.string('username').unique().notNullable()
        table.string('hashed_password').notNullable()
        table.string('salt').notNullable()
        table.json('meta')
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