const Server = require('template-ui/server')
const config = require('./webpack.config')
const appsConfig = require('./apps.config')

Server({
  config,
  appsConfig,
  dirname: __dirname
})