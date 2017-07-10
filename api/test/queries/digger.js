"use strict";
const async = require('async')

const tools = require('../tools')

const create = (installation, data, next) => {
  const req = {
    method: 'POST',
    url: tools.url'/resources'),
    headers: tools.installationHeaders(installation),
    json: data
  }
  tools.request(req, tools.wrapResult(next))
}

const append = (installation, parentid, data, next) => {
  const req = {
    method: 'POST',
    url: tools.url'/resources/' + parentid),
    headers: tools.installationHeaders(installation),
    json: data
  }
  tools.request(req, tools.wrapResult(next))
}

const list = (installation, qs, next) => {
  const req = {
    method: 'GET',
    url: tools.url'/resources'),
    qs,
    headers: tools.installationHeaders(installation),
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}


const get = (installation, id, qs, next) => {
  const req = {
    method: 'GET',
    url: tools.url'/resources/' + id),
    qs,
    headers: tools.installationHeaders(installation),
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}

const getLinks = (installation, id, qs, next) => {
  const req = {
    method: 'GET',
    url: tools.url'/resources/links/' + id),
    qs,
    headers: tools.installationHeaders(installation),
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}

const children = (installation, id, qs, next) => {
  const req = {
    method: 'GET',
    url: tools.url'/resources/children' + (id ? '/' + id : '')),
    qs,
    headers: tools.installationHeaders(installation),
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}

const descendents = (installation, id, qs, next) => {
  const req = {
    method: 'GET',
    url: tools.url'/resources/descendents' + (id ? '/' + id : '')),
    qs,
    headers: tools.installationHeaders(installation),
    json: true
  } 
  tools.request(req, tools.wrapResult(next))
}

const save = (installation, id, data, next) => {
  const req = {
    method: 'PUT',
    url: tools.url'/resources/' + id),
    headers: tools.installationHeaders(installation),
    json: data
  }  
  tools.request(req, tools.wrapResult(next))
}

const del = (installation, id, next) => {
  const req = {
    method: 'DELETE',
    url: tools.url'/resources/' + id),
    headers: tools.installationHeaders(installation),
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}

const copy = (installation, target, ids, next) => {
  const req = {
    method: 'POST',
    url: tools.url'/resources/paste/' + target),
    qs: {
      copy: ids.join(',')
    },
    headers: tools.installationHeaders(installation),
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}

const badCopy = (installation, target, ids, next) => {
  const req = {
    method: 'POST',
    url: tools.url'/resources/paste/' + target),
    qs: {
      mode: 'copy',
      ids: {
        value: []
      }
    },
    headers: tools.installationHeaders(installation),
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}

const cut = (installation, target, ids, next) => {
  const req = {
    method: 'POST',
    url: tools.url'/resources/paste/' + target),
    qs: {
      cut: ids.join(',')
    },
    headers: tools.installationHeaders(installation),
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}

const swap = (installation, source, target, mode, next) => {
  const req = {
    method: 'POST',
    url: tools.url'/resources/swap/' + source + '/' + mode + '/' + target),
    headers: tools.installationHeaders(installation),
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}

module.exports = {
  create,
  append,
  list,
  get,
  getLink,
  children,
  descendents,
  save,
  del,
  copy,
  badCopy,
  cut,
  swap
}