const path = require('path')
const express = require('express')
const webpack = require('webpack')
const morgan = require('morgan')
const fs = require('fs')
const httpProxy = require('http-proxy')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

// get a proxy server to the backend api
const proxyServer = (server) => {
  const proxy = httpProxy.createProxyServer()
  proxy.on('error', function(e) {
    console.error('Could not connect to proxy, please try again...');
  });
  return (req, res) => {
    proxy.web(req, res, {
      target: server
    })
  }
}

// apiServers has host, port, path and mount - if mount is null it means fallback
const DevServer = (opts = {}) => {
  let { webpackConfig, appsConfig, dirname } = opts
  appsConfig = appsConfig || {}
  
  const APPS = appsConfig.apps || []
  const APISERVERS = appsConfig.apiServers || []

  const app = express()
  app.use(morgan('tiny'))

  const isDevelopment = process.env.NODE_ENV !== "production"

  APPS.forEach(app => {
    if(!app.name) throw new Error('each app must have a name')
  })

  const compiler = webpack(webpackConfig)

  const devMiddleware = webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true
    }
  })

  // the express handler for server-side render of single app
  const appServer = (appConfig) => (req, res) => {
    const htmlBuffer = devMiddleware.fileSystem.readFileSync(`${webpackConfig.output.path}/${appConfig.name}/index.html`)
    res.send(htmlBuffer.toString())
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

  // mount a proxy for each of the apiServer paths
  // this is a fallback so any request not handled by webpack or the index.html server will reach here
  APISERVERS.forEach(apiServer => {
    const proxy = proxyServer(apiServer)
    if(apiServer.path) {
      app.use(apiServer.path, proxy)
    }
    else {
      app.use(proxy)
    }
  })
  
  app.listen(process.env.PORT || 80, '0.0.0.0', function (err) {
    if (err) {
      console.log(err);
      return;
    }
  })
}

module.exports = DevServer