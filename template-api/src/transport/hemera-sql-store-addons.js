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
}

module.exports = HemeraSqlAddons