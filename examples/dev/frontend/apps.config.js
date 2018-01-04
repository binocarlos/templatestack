const CONFIG = {
  apps: [{
    "name": "app",
    "title": "Stack Dev"
  }],
  apiServers: [{
    path: '/',
    host: process.env.API_SERVICE_HOST || 'api',
    port: process.env.API_SERVICE_PORT || 80
  }],
  sharedModules: [
    
  ]
}

module.exports = CONFIG