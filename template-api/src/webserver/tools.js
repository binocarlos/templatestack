const urlparse = require('url').parse
const express = require('express')
const httpProxy = require('http-proxy')

const getQueryString = (req) => urlparse(req.url, true).query
const staticServer = (dir) => express.static(dir)
const proxyServer = (backend) => {
  const proxy = httpProxy.createProxyServer()
  return (req, res) => {
    proxy.web(req, res, {
      target: `http://${backend}`
    })
  }
}

module.exports = {
  getQueryString,
  staticServer,
  proxyServer
}