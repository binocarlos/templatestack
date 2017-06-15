const settings = require('./settings')
const Databases = require('./databases')
const Controllers = require('./controllers')
const App = require('./app')

const databases = Databases(settings)
const controllers = Controllers(settings, databases)
const app = App(settings, databases, controllers)

app.listen(settings.port)
