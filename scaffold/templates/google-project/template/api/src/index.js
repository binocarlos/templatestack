'use strict'

const settings = require('./settings')
const Backends = require('./backends')
const Clients = require('./clients')
const App = require('./app')

const backends = Backends()
const clients = Clients(backends)

backends.user.setAuthClient(clients.auth)

const app = App({
  clients
})
app.listen(settings.port, () => {
  console.log(`webserver listening on port ${settings.port}`)
})
