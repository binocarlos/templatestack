'use strict'

const AuthRoutes = require('template-api/src/auth/routes')
const SystemRoutes = require('template-api/src/system/routes')
const Access = require('template-api/src/auth/access')
const path = require('path')

const Routes = (app, transport, settings) => {
  const auth = AuthRoutes(transport)
  const system = SystemRoutes(transport)

  const access = Access()
  const basePath = (path) => settings.base + path
  
  app.get(basePath('/version'), system.version)

  app.get(basePath('/auth/status'), auth.status)
  app.post(basePath('/auth/login'), auth.login)
  app.post(basePath('/auth/register'), auth.register)
  app.put(basePath('/auth/update'), access.loggedIn(), auth.update)
  app.get(basePath('/auth/logout'), auth.logout)

  app.set('views', path.join(__dirname, 'views'))

  const adminApp = (req, res) => {
    res.render('app', { 
      page: {
        title: 'App Admin',
        description: 'Admin Panel'
      },
      stylesheets: [
        '/admin.css'
      ],
      scripts: [
        '/admin.js'
      ]
    })
  }

  app.get('/admin/*', adminApp)
  app.get('/admin/', adminApp)
  app.get('/admin', adminApp)
}

module.exports = Routes