"use strict";
const async = require('async')

const tools = require('../tools')

const UserData = (count) => {
  count = count || ''
  const ts = new Date().getTime()
  return {
    username: 'user' + ts + count + '@test.com',
    password: 'apples',
    meta: {
      testmeta: 10
    }
  }
}

const register = (user, next) => {
  const req = {
    method: 'POST',
    url: tools.url('/auth/register'),
    headers: tools.headers(),
    json: user
  }
  tools.request(req, tools.wrapResult(next))
}

const login = (user, next) => {
  const req = {
    method: 'POST',
    url: tools.url('/auth/login'),
    headers: tools.headers(),
    json: user
  }
  tools.request(req, tools.wrapResult(next))
}

const update = (data, next) => {
  const req = {
    method: 'PUT',
    url: tools.url('/auth/update'),
    headers: tools.headers(),
    json: data
  }
  tools.request(req, tools.wrapResult(next))
}

const save = (data, next) => {
  const req = {
    method: 'PUT',
    url: tools.url('/auth/save'),
    headers: tools.headers(),
    json: data
  }
  tools.request(req, tools.wrapResult(next))
}

const logout = (next) => {
  const req = {
    method: 'GET',
    url: tools.url('/auth/logout'),
    headers: tools.headers(),
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}

const status = (next) => {
  const req = {
    method: 'GET',
    url: tools.url('/auth/status'),
    headers: tools.headers(),
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}

const registerAccount = (done) => {
  register(UserData(), (err, result) => {
    if(result.statusCode != 201) return err(`bad status: ${result.statusCode}`)
    done(null, result.body)
  })
}

module.exports = {
  UserData,
  registerAccount,
  register,
  register,
  update,
  save,
  login,
  logout,
  status
}