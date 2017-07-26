const path = require('path')
const express = require('express')
const webpack = require('webpack')
const morgan = require('morgan')
const fs = require('fs')
const httpProxy = require('http-proxy')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

//const config = require('./webpack.config')
//const appsConfig = require('./apps.config')
const DevServer = ({ config, appsConfig, dirname } = opts) => {
  

  const APPS = appsConfig.apps
  const app = express()
  app.use(morgan('tiny'))

  const isDevelopment = process.env.NODE_ENV !== "production"

  const DIST_DIR = path.join(dirname, "dist")
  const API_PATH = process.env.API_PATH || '/api/v1'
  const API_SERVICE_HOST = process.env.API_SERVICE_HOST || 'api'
  const API_SERVICE_PORT = process.env.API_SERVICE_PORT || 80

  APPS.forEach(app => {
    if(!app.name) throw new Error('each app must have a name')
  })

  const compiler = webpack(config)

  const devMiddleware = webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    stats: {
      colors: true
    }
  })

  // the express handler for server-side render of single app
  const appServer = (appConfig) => (req, res) => {
    const htmlBuffer = devMiddleware.fileSystem.readFileSync(`${config.output.path}/${appConfig.name}/index.html`)
    res.send(htmlBuffer.toString())
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

  app.use(webpackHotMiddleware(compiler, {
    log: console.log
  }))
  app.use(devMiddleware)

  APPS.forEach(appConfig => {
    if(!appConfig.name) throw new Error('each app must have a name')
    const route = `/${appConfig.name}*`
    console.log(`mounting ${route}`)
    app.get(route, appServer(appConfig))
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
}

module.exports = DevServer