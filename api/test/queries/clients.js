"use strict";
const async = require('async')

const tools = require('../tools')

const ClientData = (count) => {
  count = count || ''
  const ts = new Date().getTime()
  return {
    username: 'user' + ts + count + '@test.com',
    meta: {
      name: 'test client ' + ts + count
    }
  }
}

const create = (installation, data, next) => {
  const req = {
    method: 'POST',
    url: tools.url('/clients'),
    headers: tools.installationHeaders(installation),
    json: data
  }
  tools.request(req, tools.wrapResult(next)) 
}

const list = (installation, next) => {
  const req = {
    method: 'GET',
    url: tools.url('/clients'),
    headers: tools.installationHeaders(installation),
    json: true
  }
  tools.request(req, tools.wrapResult(next)) 
}

const get = (installation, id, next) => {
  const req = {
    method: 'GET',
    url: tools.url('/clients/' + id),
    headers: tools.installationHeaders(installation),
    json: true
  }
  tools.request(req, tools.wrapResult(next)) 
}


const newClient = (next) => {
  const req = {
    method: 'GET',
    url: tools.url('/clients/new'),
    headers: tools.installationHeaders(installation),
    json: true
  }
  tools.request(req, tools.wrapResult(next)) 
}

const save = (installation, id, data, next) => {
  const req = {
    method: 'PUT',
    url: tools.url('/clients/' + id),
    headers: tools.installationHeaders(installation),
    json: data
  }
  tools.request(req, tools.wrapResult(next))
}

const del = (installation, id, next) => {
  const req = {
    method: 'DELETE',
    url: tools.url('/clients/' + id),
    headers: tools.installationHeaders(installation),
  }
  tools.request(req, tools.wrapResult(next))
}

module.exports = {
  ClientData,
  create,
  list,
  get,
  newClient,
  save,
  del
}