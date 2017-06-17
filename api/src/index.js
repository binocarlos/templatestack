'use strict'

const settings = require('./settings')
const Databases = require('./databases')
const TransportFactory = require('./transportFactory')
const Backend = require('./backend')
const App = require('./app')

const databases = Databases(settings)
const transportFactory = TransportFactory(settings)

const backend = Backend(settings, databases, transportFactory)
const app = App(settings, databases, transportFactory)

app.listen(settings.port)