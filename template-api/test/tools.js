const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const WebServer = () => {
  const app = express()
  app.use(bodyParser.json())
  app.use(cookieParser())
}

module.exports = {
  WebServer
}