'use strict'

const AuthRoutes = require('template-api/src/auth/routes')
const Access = require('template-api/src/auth/access')

const Routes = (app, transport, settings) => {
  const auth = AuthRoutes(transport)
  const access = Access()
  const basePath = (path) => settings.base + path
  
  app.get(basePath('/status'), auth.status)
  app.post(basePath('/login'), auth.login)
  app.post(basePath('/register'), auth.register)
  app.put(basePath('/update'), access.loggedIn(), auth.update)
  app.get(basePath('/logout'), auth.logout)

  const adminApp = (req, res) => {
    res.render('app', { 
      title: 'App Admin',
      stylesheets: [
        '/admin.css'
      ],
      scripts: [
        '/admin.js'
      ]
    })
  }

  app.get('/admin*', adminApp)
  app.get('/admin', adminApp)
}

module.exports = Routes