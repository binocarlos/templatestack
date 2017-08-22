'use strict'

const Client = require('template-api/src/grpc/client')

const settings = require('./settings')
const Backends = require('./backends')
const App = require('./app')

const backends = Backends()

const clients = Object.keys(backends).reduce((all, field) => {
  all[field] = Client(backends[field])
  return all
}, {})

const app = App({
  clients
})
app.listen(settings.port, () => {
  console.log(`webserver listening on port ${settings.port}`)
})
