'use strict'

const DEFAULT_OPTS = {
  installationTablename: 'installation',
  resourceTablename: 'resource'
}

const DiggerMigration = (opts = {}) => {
  opts = Object.assign({}, DEFAULT_OPTS, opts)

  const up = (knex, Promise) => {
   return Promise.all([
      knex.schema.raw("CREATE EXTENSION ltree"),

      knex.schema.createTable(opts.resourceTablename, (table) => {
        table.increments('id')
          .primary()
        if(opts.installationTablename) {
          table.integer(opts.installationTablename)
            .references('id')
            .inTable(opts.installationTablename)
            .onDelete('cascade')
        }
        table.integer('parent')
          .references('id')
          .inTable(opts.resourceTablename)
          .onDelete('cascade')
        table.specificType('ltree', 'path')
        table.string('namespace')
          .defaultTo('default')
        table.string('name')
          .notNullable()
        table.json('meta')
      }),

      knex.schema.createTable(`${opts.resourceTablename}_link`, (table) => {
        table.increments('id')
          .primary()
        table.integer('parent')
          .references('id')
          .inTable(opts.resourceTablename)
          .onDelete('cascade')
        table.integer('child')
          .references('id')
          .inTable(opts.resourceTablename)
          .onDelete('cascade')
        table.string('type')
          .notNullable()
        table.json('meta')
      })
    ])
  }

  const down = (knex, Promise) => {
    return Promise.all([
      knex.schema.dropTable(`${opts.resourceTablename}_link`),
      knex.schema.dropTable(opts.resourceTablename),
      knex.schema.raw("DROP EXTENSION ltree"),
    ])
  }

  return {
    up,
    down
  }
}

module.exports = DiggerMigration