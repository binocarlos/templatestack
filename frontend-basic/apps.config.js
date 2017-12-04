const CONFIG = {
  apps: [{
    "name": "ui",
    "title": "Track Tube"
  },{
    "name": "admin",
    "title": "Track Tube Admin"
  }],
  apiServers: [{
    path: '/api/v1',
    host: process.env.API_SERVICE_HOST || 'api',
    port: process.env.API_SERVICE_PORT || 80
  }],
  sharedModules: [
    
  ]
}

module.exports = CONFIG