'use strict'

const options = require('../utils/options')
const pg = require('pg')

const REQUIRED = [
  'host',
  'user',
  'password',
  'database'
]

const DEFAULTS = {
  port: 5432
}

const Pool = (opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS,
    throwError: true
  })
  return new pg.Pool(opts)
}

const Query = (pool) => (sql, params, done) => pool.query(sql, params, done)
const Transaction = (pool) => (handler, done) => {
  pool.connect((err, client, release) => {
    if(err) {
      release()
      return done(err)
    }

    async.series({
      begin:   (next) => client.query('BEGIN', next),
      command: (next) => handler(client, next),
      commit:  (next) => client.query('COMMIT', next)
    }, (err, results) => {
      if(err) {
        db.run('ROLLBACK', () => {
          release()
          done(err)
        })
      }
      else{
        release()
        done(null, results.command)
      }
    })
  })
}

const Postgres = (opts) => {
  opts = opts || {}
  const pool = Pool(opts)

  return {
    pool: pool,
    query: Query(pool),
    transaction: Transaction(pool)
  }
}

module.exports = Postgres