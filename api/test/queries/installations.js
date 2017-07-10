"use strict";
const async = require('async')

const tools = require('../tools')

const list = (next) => {
  const req = {
    method: 'GET',
    url: tools.url('/installations'),
    headers: tools.headers(),
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}

const create = (data, next) => {
  const req = {
    method: 'POST',
    url: tools.url('/installations'),
    headers: tools.headers(),
    json: data
  }
  tools.request(req, tools.wrapResult(next))
}

const save = (id, data, next) => {
  const req = {
    method: 'PUT',
    url: tools.url('/installations/' + id),
    headers: tools.headers(),
    json: data
  }
  tools.request(req, tools.wrapResult(next))
}

const get = (id, next) => {
  const req = {
    method: 'GET',
    url: tools.url('/installations/' + id),
    headers: tools.headers(),
    json: true
  }
  request(req, tools.wrapResult(next))
}

const del = (id, next) => {
  const req = {
    method: 'DELETE',
    url: tools.url('/installations/' + id),
    headers: tools.headers()
  }
  tools.request(req, tools.wrapResult(next))
}

const activate = (id, next) => {
  const req = {
    method: 'PUT',
    url: tools.url('/installations/' + id + '/activate'),
    headers: tools.headers()
  }
  tools.request(req, tools.wrapResult(next))
}

module.exports = {
  list,
  create,
  save,
  get,
  del,
  activate
}