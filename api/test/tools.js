"use strict";
const async = require('async')
const Request = require('request')
const request = Request.defaults({jar: true})

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:80'

const url = (path) => {
  path = path || ''
  return BASE_URL + path
}

const headers = () => {
  return {

  }
}

const UserData = (count) => {
  count = count || ''
  const ts = new Date().getTime()
  return {
    email: 'user' + ts + count + '@test.com',
    password: 'apples'
  }
}

const wrapResult = (done) => (err, res, body) => {
  if(err) return done(err)
  done(null, {
    statusCode: res.statusCode,
    body: body
  })
}

const register = (user, next) => {
  const req = {
    method: 'POST',
    url: url('/api/v1/register'),
    headers: headers(),
    json: user
  }
  if(process.env.TRACE_TEST) {
    console.log('register')
    console.log(JSON.stringify(req, null, 4))
  }
  request(req, wrapResult(next))
}

const login = (user, next) => {
  const req = {
    method: 'POST',
    url: url('/api/v1/login'),
    headers: headers(),
    json: user
  }
  if(process.env.TRACE_TEST) {
    console.log('login')
    console.log(JSON.stringify(req, null, 4))
  }
  request(req, wrapResult(next))
}

const logout = (next) => {
  const req = {
    method: 'GET',
    url: url('/api/v1/logout'),
    headers: headers(),
    followAllRedirects: true
  }
  if(process.env.TRACE_TEST) {
    console.log('logout')
    console.log(JSON.stringify(req, null, 4))
  }
  request(req, wrapResult(next))
}

const status = (next) => {
  const req = {
    method: 'GET',
    url: url('/api/v1/status'),
    headers: headers(),
    json: true
  }
  if(process.env.TRACE_TEST) {
    console.log('status')
    console.log(JSON.stringify(req, null, 4))
  }
  request(req, wrapResult(next))
}

module.exports = {
  UserData,
  request,
  url,
  register,
  wrapResult,
  headers,
  register,
  login,
  logout,
  status
}