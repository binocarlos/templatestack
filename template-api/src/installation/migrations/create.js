'use strict'

const DEFAULT_OPTS = {
  installationTablename: 'installation',
  collaborationTablename: 'collaboration',
  userTablename: 'useraccount'
}

const InstallationMigration = (opts = {}) => {
  opts = Object.assign({}, DEFAULT_OPTS, opts)

  const up = (knex, Promise) => {
   return Promise.all([

      /*
      
        installation
        
      */
      knex.schema.createTable(opts.installationTablename, function(table) {

        table.increments('id')
          .primary()

        table.string('name')
          .notNullable()

        table.json('meta')
      }),

      /*
      
        collaboration
        
      */
      knex.schema.createTable(opts.collaborationTablename, function(table) {

        table.increments('id')
          .primary()

        table.integer(opts.userTablename)
          .references('id')
          .inTable(opts.userTablename)
          .notNullable()
          .onDelete('cascade')
        
        table.integer(opts.installationTablename)
          .references('id')
          .inTable(opts.installationTablename)
          .notNullable()
          .onDelete('cascade')

        table.json('meta')
      })
    ])
  }

  const down = (knex, Promise) => {
    return Promise.all([
      knex.schema.dropTable(opts.collaborationTablename),
      knex.schema.dropTable(opts.installationTablename)
    ])
  }

  return {
    up,
    down
  }
}

module.exports = InstallationMigration