import 'babel-polyfill'
import path from 'path'
import express from 'express'
import webpack from 'webpack'
import morgan from 'morgan'
import fs from 'fs'
import httpProxy from 'http-proxy'
import config from './webpack.config'
import appsConfig from './apps.config'

const APPS = appsConfig.apps
const app = express()
app.use(morgan('tiny'))

const isDevelopment = process.env.NODE_ENV !== "production"

const DIST_DIR = path.join(__dirname, "dist")
const API_PATH = process.env.API_PATH || '/api/v1'
const API_SERVICE_HOST = process.env.API_SERVICE_HOST || 'api'
const API_SERVICE_PORT = process.env.API_SERVICE_PORT || 80

APPS.forEach(app => {
  if(!app.name) throw new Error('each app must have a name')
})

// the express handler for server-side render of single app
const appServer = (appOptions) => (req, res) => {
  res
    .status(200)
    .sendFile(path.join(__dirname, 'www', appOptions.name, 'index.html'))
}

// get a proxy server to the backend api
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

// webpack-dev setup for hot-reloading
if (isDevelopment) {
  const compiler = webpack(config)
  console.log(`using development tools`)
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    stats: {
      colors: true
    }
  }))
  app.use(require('webpack-hot-middleware')(compiler, {
    log: console.log
  }))
}
// production setup - serve from dist
else {
  app.use(express.static(DIST_DIR))
}

// anypath handler for each app
APPS.forEach(appOptions => {
  console.log(`mounting ${appOptions.name} handler: /${appOptions.name}*`)
  app.get(`/${appOptions.name}*`, appServer(appOptions))
})

// a proxy back to /api/v1
// this will be handled by ingress in production
app.use(API_PATH, proxyServer(API_SERVICE_HOST))

app.listen(process.env.PORT || 80, '0.0.0.0', function (err) {
  if (err) {
    console.log(err);
    return;
  }
})