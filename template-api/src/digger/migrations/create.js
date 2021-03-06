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
        table.specificType('id', 'serial primary key not null')
        table.specificType('created_at', 'timestamp default now()')
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
        table.specificType('path', 'ltree')
        table.string('namespace')
          .defaultTo('default')
        table.string('name')
          .notNullable()
        table.string('type')
          .notNullable()
        table.specificType('labels', 'text[][]')
        table.json('meta')
      }),

      knex.schema.createTable(`${opts.resourceTablename}_link`, (table) => {
        table.specificType('id', 'serial primary key not null')
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