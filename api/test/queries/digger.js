"use strict";
const async = require('async')

const tools = require('../tools')

const create = (i, data, next) => {
  const req = {
    method: 'POST',
    url: tools.url(`/i/${i}/resources`),
    json: data
  }
  tools.request(req, tools.wrapResult(next))
}

const append = (i, parentid, data, next) => {
  const req = {
    method: 'POST',
    url: tools.url(`/i/${i}/resources/${parentid}`),
    json: data
  }
  tools.request(req, tools.wrapResult(next))
}

const list = (i, qs, next) => {
  const req = {
    method: 'GET',
    url: tools.url(`/i/${i}/resources`),
    qs,
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}


const get = (i, id, qs, next) => {
  const req = {
    method: 'GET',
    url: tools.url(`/i/${i}/resources/${id}`),
    qs,
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}

const getLinks = (i, id, qs, next) => {
  const req = {
    method: 'GET',
    url: tools.url(`/i/${i}/resources/links/${id}`),
    qs,
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}

const children = (i, id, qs, next) => {
  const req = {
    method: 'GET',
    url: tools.url(`/i/${i}/resources/children${ id ? '/' + id : '' }`),
    qs,
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}

const descendents = (i, id, qs, next) => {
  const req = {
    method: 'GET',
    url: tools.url(`/i/${i}/resources/descendents${ id ? '/' + id : '' }`),
    qs,
    json: true
  } 
  tools.request(req, tools.wrapResult(next))
}

const save = (i, id, data, next) => {
  const req = {
    method: 'PUT',
    url: tools.url(`/i/${i}/resources/${id}`),
    json: data
  }  
  tools.request(req, tools.wrapResult(next))
}

const del = (i, id, next) => {
  const req = {
    method: 'DELETE',
    url: tools.url(`/i/${i}/resources/${id}`),
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}

const copy = (i, target, ids, next) => {
  const req = {
    method: 'POST',
    url: tools.url(`/i/${i}/resources/paste/${target}`),
    qs: {
      copy: ids.join(',')
    },
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}

const badCopy = (i, target, ids, next) => {
  const req = {
    method: 'POST',
    url: tools.url(`/i/${i}/resources/paste/${target}`),
    qs: {
      mode: 'copy',
      ids: {
        value: []
      }
    },
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}

const cut = (i, target, ids, next) => {
  const req = {
    method: 'POST',
    url: tools.url(`/i/${i}/resources/paste/${target}`),
    qs: {
      cut: ids.join(',')
    },
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}

const swap = (i, source, target, mode, next) => {
  const req = {
    method: 'POST',
    url: tools.url(`/i/${i}/resources/swap/${source}/${mode}/${target}`),
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