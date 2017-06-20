'use strict'

const settings = require('./settings')
const Databases = require('./databases')
const Transport = require('./transport')
const Backend = require('./backend')
const App = require('./app')

const databases = Databases(settings)
const transport = Transport(settings, databases)

const backend = Backend(settings, databases, transport)
const app = App(settings, databases, transport)
app.listen(settings.port)