const path = require('path');
const express = require('express');
const webpack = require('webpack');
const fs = require('fs');
const config = require('./webpack.config.dev');
const ecstatic = require('ecstatic')

const app = express();
const compiler = webpack(config);

const APPS = ['admin', 'booking']

// folders we serve static content from - in order of preference
const STATICS = [
  path.join(__dirname, 'www'),
  path.join(__dirname, '..', 'muse', 'build', 'barn')
]

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
}));

app.use(require('webpack-hot-middleware')(compiler))

// serve an apps index.html for any path below the app (so we get HTML5 routing)
app.use(function(req, res, next){
  const foundapp = APPS.filter(function(app){
    return (req.url == '/' + app) || (req.url.indexOf('/' + app + '/') == 0)
  })[0]
  if(!foundapp) return next()
  res.sendFile(path.join(__dirname, './www/' + foundapp + '/index.html'));
})

// serve a merged copy of STATICS
app.use(function(req, res, next){
  const url = (req.url.match(/\.\w+/) ? req.url : req.url + '/index.html').replace(/\/+/g, '/').replace(/\?.*$/, '')
  const servePath = STATICS
    .map(base => path.join(base, decodeURIComponent(url)))
    .filter(filepath => fs.existsSync(filepath))[0]
  if(!servePath) return next()
  res.sendFile(servePath)
})

app.use(function(req, res) {
  res.status(404)
  res.end('not found')
})

app.listen(process.env.PORT || 80, '0.0.0.0', function (err) {
  if (err) {
    console.log(err);
    return;
  }
});