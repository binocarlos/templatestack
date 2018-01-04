'use strict'

const settings = require('./settings')
const Backends = require('./backends')
const Clients = require('template-api/src/grpc/clients')
const App = require('./app')

const backends = Backends()
const clients = Clients(backends)

const app = App({
  clients
})
app.listen(settings.port, () => {
  console.log(`webserver listening on port ${settings.port}`)
})
