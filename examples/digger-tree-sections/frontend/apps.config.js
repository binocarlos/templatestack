const CONFIG = {
  apps: [{
    "name": "admin",
    "title": "Booking Admin"
  },{
    "name": "booking",
    "title": "Booking Form"
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