'use strict'

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
    database(req.collection)
      .where(req.query)
      .update(data)
      .returning('*')
      .asCallback(done)
  })

}

module.exports = HemeraSqlAddons