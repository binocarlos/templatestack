'use strict'

const refresh = require('passport-oauth2-refresh')
const tools = require('template-api/src/database/tools')
const options = require('template-tools/src/utils/options')
const async = require('async')

const REQUIRED = [
  'knex'
]

const DEFAULTS = {

}

const SEARCH_FIELDS = [
  `meta->'google'->>'displayName'`
]

const UserBackend = (opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const knex = opts.knex
  let authClient = null
  
  /*
  
    load

      * id
    
  */
  const list = (call, done) => {
    const req = call.request || {}
    const q = knex
      .select()
      .from('useraccount')

    if(req.search) {
      const sql = SEARCH_FIELDS.map(f => `${f} ILIKE ?`).join(' or ')
      const params = SEARCH_FIELDS.map(f => `%${req.search}%`)
      q.whereRaw(sql, params)
    }
    
    q.asCallback(tools.allExtractor(done))
  }

  const load = (call, done) => {
    const req = call.request || {}

    knex
      .select()
      .from('useraccount')
      .where({
        id: req.id
      })
      .asCallback(tools.singleExtractor(done))
  }

  /*
  
    token

      * id
    
  */
  const token = (call, done) => {
    async.waterfall([
      (next) => load(call, next),
      (user, next) => {
        const token = (user.meta || {}).googleToken || {}
        next(null, token.value || '')
      }
    ], done)
  }

  /*
  
    token

      * id
    
  */
  const refreshToken = (call, done) => {
    async.waterfall([
      (next) => load(call, next),
      (user, next) => {
        const token = (user.meta || {}).googleToken || {}
        const refreshToken = token.refresh || token.secret
        refresh.requestNewAccessToken('google', refreshToken, (err, accessToken) => {
          if(err) return done(err)
          user.meta.googleToken = {
            value: accessToken,
            refresh: refreshToken
          }
          authClient.update({
            id: user.id,
            data: user.meta
          }, (err) => {
            if(err) return next(err)
            next(null, accessToken)
          })
        })
      }
    ], done)
  }

  const setAuthClient = (c) => authClient = c

  return {
    list,
    load,
    token,
    refreshToken,
    setAuthClient
  }
}

module.exports = UserBackend