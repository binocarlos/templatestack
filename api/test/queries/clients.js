"use strict";
const async = require('async')

const tools = require('../tools')

const ClientData = (count) => {
  count = count || ''
  const ts = new Date().getTime()
  return {
    username: 'client' + ts + count + '@test.com',
    meta: {
      name: 'test client ' + ts + count
    }
  }
}

const create = (i, data, next) => {
  const req = {
    method: 'POST',
    url: tools.url(`/i/${i}/clients`),
    headers: tools.installationHeaders(installation),
    json: data
  }
  tools.request(req, tools.wrapResult(next)) 
}

const list = (i, next) => {
  const req = {
    method: 'GET',
    url: tools.url(`/i/${i}/clients`),
    headers: tools.installationHeaders(installation),
    json: true
  }
  tools.request(req, tools.wrapResult(next)) 
}

const get = (i, id, next) => {
  const req = {
    method: 'GET',
    url: tools.url(`/i/${i}/clients/${id}`),
    headers: tools.installationHeaders(installation),
    json: true
  }
  tools.request(req, tools.wrapResult(next)) 
}

const save = (i, id, data, next) => {
  const req = {
    method: 'PUT',
    url: tools.url(`/i/${i}/clients/${id}`),
    headers: tools.installationHeaders(installation),
    json: data
  }
  tools.request(req, tools.wrapResult(next))
}

const del = (i, id, next) => {
  const req = {
    method: 'DELETE',
    url: tools.url(`/i/${i}/clients/${id}`),
    headers: tools.installationHeaders(installation),
  }
  tools.request(req, tools.wrapResult(next))
}

module.exports = {
  ClientData,
  create,
  list,
  get,
  save,
  del
}