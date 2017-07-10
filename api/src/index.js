'use strict'

const settings = require('./settings')
const Databases = require('./databases')
const Transport = require('./transport')
const App = require('./app')

const databases = Databases()
const transport = Transport(databases)
const app = App(transport, databases)

app.listen(settings.port)