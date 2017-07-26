const CONFIG = {
  apps: [{
    "name": "admin",
    "title": "Admin Panel"
  }],
  apiServers: [{
    path: '/api/v1',
    host: process.env.API_SERVICE_HOST || 'api',
    port: process.env.API_SERVICE_PORT || 80
  }],
  sharedModules: [
    'shared/src'
  ]
}

module.exports = CONFIG