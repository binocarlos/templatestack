'use strict'

const settings = require('./settings')

if(settings.backend) {
  const Backend = require('./backend')
  Backend()
}

if(settings.webserver) {
  const App = require('./app')
  const app = App()
  app.listen(settings.port, () => {
    console.log(`webserver listening on port ${settings.port}`)
  })
}
