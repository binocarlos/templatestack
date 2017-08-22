'use strict'

const tools = require('../database/tools')

const HemeraSqlAddons = (transport, database) => {

  transport.add({
    topic: 'sql-store-addons',
    cmd: 'create'
  }, (req, done) => {
    database
      .insert(req.data)
      .into(req.collection)
      .returning('*')
      .asCallback(done)
  })

  transport.add({
    topic: 'sql-store-addons',
    cmd: 'update'
  }, (req, done) => {
    transport.act({
      topic: 'sql-store',
      cmd: 'update',
      collection: req.collection,
      query: req.query,
      data: req.data
    }, (err) => {
      if(err) return done(err)
      transport.act({
        topic: 'sql-store',
        cmd: 'find',
        collection: req.collection,
        query: req.query
      }, tools.singleExtractor(done))
    })
  })

}

module.exports = HemeraSqlAddons