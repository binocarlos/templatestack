'use strict'

const UserMigration = (opts = {}) => {
  const up = (knex, Promise) => {
   return Promise.all([
      knex.schema.createTable('useraccount', function(table) {
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
      knex.schema.dropTable('useraccount')
    ])
  }

  return {
    up,
    down
  }
}

module.exports = UserMigration