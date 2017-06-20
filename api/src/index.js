'use strict'

const settings = require('./settings')
const Databases = require('./databases')
const ClientTransport = require('./transport/client')
const ServerTransport = require('./transport/server')
const Backend = require('./backend')
const App = require('./app')

const databases = Databases(settings)
const serverTransport = ServerTransport(settings, databases)
const clientTransport = ClientTransport(settings)

const backend = Backend(settings, databases, serverTransport)
const app = App(settings, databases, clientTransport)

app.listen(settings.port)