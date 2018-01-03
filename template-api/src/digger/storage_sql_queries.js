'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const async = require('async')
const options = require('template-tools/src/utils/options')
const tools = require('../database/tools')

const REQUIRED = [
  'tables'
]

const ResourceSQL = (opts = {}) => {

  opts = options.processor(opts, {
    required: REQUIRED
  })

  const tables = opts.tables

  const links = (query) => {

    const ids = query.id ? [query.id] : (query.ids || [])
    const installationid = query.installationid

    const clause = ids.map((id, i) => {
      return `${tables.link}.parent = ?`
    }).join(`
  or
  `)

    const insertClause = clause ?
      `and ( ${clause} )` :
      ''

    const sql = `select
  ${tables.resource}.*,
  ${tables.link}.parent as link_parent,
  ${tables.link}.meta as link_meta
  from
  ${tables.resource}
  join
  ${tables.link}
  on
  (
  ${tables.resource}.${tables.installation} = ?
  ${tables.link}.child = ${tables.resource}.id
  and
  ${tables.link}.type = 'resource'
  ${insertClause}
  )
  order by
  ${tables.link}.meta->>'order' ASC
  `

    return {
      sql,
      params: [installationid].concat(ids)
    }
  }

  // * installationid
  // * id
  // * type
  // * search
  // * namespace
  const search = (query) => {

    let params = [query.installationid]
    let clause = [
      `${tables.installation} = ?`
    ]

    if(query.type) {
      clause.push('type = ?')
      params.push(query.type)
    }

    if(query.search) {
      clause.push('lower(name) like lower(?)')
      params.push(`%${query.search}%`)
    }

    if(query.namespace) {
      clause.push('namespace = ?')
      params.push(query.namespace)
    }

    const sqlClause = clause.join(' and ')

    const sql = `select *
from
  resource
where
(
  ${sqlClause}
)
order by
  name ASC
`

    return {
      sql,
      params
    }
  }

  // * installationid
  // * id
  // * namespace
  const children = (query) => {

    let params = [query.installationid]
    let clause = [
      `${tables.installation} = ?`
    ]

    if(query.id) {
      clause.push('parent = ?')
      params.push(query.id)
    }
    else {
      clause.push('parent is null') 
    }

    if(query.type) {
      clause.push('type = ?')
      params.push(query.type)
    }

    if(query.namespace) {
      clause.push('namespace = ?')
      params.push(query.namespace)
    }

    if(query.search) {
      clause.push('lower(name) like lower(?)')
      params.push(`%${query.search}%`)
    }

    const sqlClause = clause.join(' and ')

    const sql = `select *
from
  resource
where
(
  ${sqlClause}
)
order by
  name ASC
`

    return {
      sql,
      params
    }
  }

  // * installationid
  // * id
  // * search
  // * type
  // * namespace
  const descendents = (query) => {
    if(!query.id) return search(query)

    let params = [query.id, query.installationid]
    let clause = [
      `${tables.installation} = ?`
    ]

    if(query.type) {
      clause.push('type = ?')
      params.push(query.type)
    }

    if(query.search) {
      clause.push('lower(name) like lower(?)')
      params.push(`%${query.search}%`)
    }

    if(query.namespace) {
      clause.push('namespace = ?')
      params.push(query.namespace)
    }

    const sqlClause = clause.join(' and ')

    const sql = `select *
from
  resource
where
  path <@ (
    select
      path::text || '.' || id::text as path
    from
      resource
    where
      id = ?
  )::ltree
  and
  (
    ${sqlClause}
  )
order by
  name ASC
`

    return {
      sql,
      params
    }
  }

  return {
    links,
    search,
    children,
    descendents
  }

}

module.exports = ResourceSQL