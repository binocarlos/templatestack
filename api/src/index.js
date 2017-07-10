'use strict'

const settings = require('./settings')
const Databases = require('./databases')
const Transport = require('./transport')
const App = require('./app')

const databases = Databases(settings)
const transport = Transport(settings, databases)
const app = App(settings, transport, databases)

app.listen(settings.port)