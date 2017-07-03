const path = require('path')
const express = require('express')
const webpack = require('webpack')
const fs = require('fs')
const httpProxy = require('http-proxy')
const config = require('./webpack.config.dev')
const packageJSON = require('./package.json')

const app = express()
const compiler = webpack(config)

const isDevelopment = process.env.NODE_ENV !== "production"
const APPS = packageJSON.template_apps
const DIST_DIR = path.join(__dirname, "dist")
const API_PATH = process.env.API_PATH || '/api/v1'
const API_SERVICE_HOST = process.env.API_SERVICE_HOST || 'api'
const API_SERVICE_PORT = process.env.API_SERVICE_PORT || 80

const proxyServer = (backend) => {
  const proxy = httpProxy.createProxyServer()
  proxy.on('error', function(e) {
    console.error('Could not connect to proxy, please try again...');
  });
  return (req, res) => {
    proxy.web(req, res, {
      target: {
        host: API_SERVICE_HOST,
        port: API_SERVICE_PORT,
        path: API_PATH
      }
    })
  }
}

if (isDevelopment) {
  console.log(`using development tools`)
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    stats: {
      colors: true
    }
  }))
  app.use(require('webpack-hot-middleware')(compiler))
}
else {
  app.use(express.static(DIST_DIR))
}

// loop over the app config in package.json and create a react server-side
// handler for each of them - each app defines it's own handler as server.js
APPS.forEach(appOptions => {
  const appname = appOptions.name
  console.log(`mounting ${appname} handler`)
  const appHandler = require(`./src/${appname}/server`)
  app.get(`/${appname}*`, appHandler)
})

// a proxy back to /api/v1
// this will be handled by ingress in production
app.use(API_PATH, proxyServer(API_SERVICE_HOST))

app.listen(process.env.PORT || 80, '0.0.0.0', function (err) {
  if (err) {
    console.log(err);
    return;
  }
});