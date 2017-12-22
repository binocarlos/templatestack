'use strict'

const DEFAULT_OPTS = {
  projectTablename: 'project',
  collaborationTablename: 'collaboration',
  userTablename: 'useraccount'
}

const ProjectMigration = (opts = {}) => {
  opts = Object.assign({}, DEFAULT_OPTS, opts)

  const up = (knex, Promise) => {
   return Promise.all([

      /*
      
        installation
        
      */
      knex.schema.createTable(opts.projectTablename, function(table) {

        table.specificType('id', 'serial primary key not null')
        table.specificType('created_at', 'timestamp default now()')

        table.string('name')
          .notNullable()

        table.json('meta')
      }),

      /*
      
        collaboration
        
      */
      knex.schema.createTable(opts.collaborationTablename, function(table) {

        table.specificType('id', 'serial primary key not null')
        table.specificType('created_at', 'timestamp default now()')

        table.integer(opts.userTablename)
          .references('id')
          .inTable(opts.userTablename)
          .notNullable()
          .onDelete('cascade')
        
        table.integer(opts.projectTablename)
          .references('id')
          .inTable(opts.projectTablename)
          .notNullable()
          .onDelete('cascade')

        table.json('meta')
      })
    ])
  }

  const down = (knex, Promise) => {
    return Promise.all([
      knex.schema.dropTable(opts.collaborationTablename),
      knex.schema.dropTable(opts.projectTablename)
    ])
  }

  return {
    up,
    down
  }
}

module.exports = ProjectMigration