"use strict";
const async = require('async')

const tools = require('../tools')

const create = (i, data, next) => {
  const req = {
    method: 'POST',
    url: tools.url(`/i/${i}/bookings`),
    json: data
  }
  tools.request(req, tools.wrapResult(next))
}

const search = (i, qs, next) => {
  const req = {
    method: 'GET',
    url: tools.url(`/i/${i}/bookings`),
    qs,
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}


const get = (i, id, qs, next) => {
  const req = {
    method: 'GET',
    url: tools.url(`/i/${i}/bookings/${id}`),
    qs,
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}

const save = (i, id, data, next) => {
  const req = {
    method: 'PUT',
    url: tools.url(`/i/${i}/bookings/${id}`),
    json: data
  }  
  tools.request(req, tools.wrapResult(next))
}

const del = (i, id, next) => {
  const req = {
    method: 'DELETE',
    url: tools.url(`/i/${i}/bookings/${id}`),
    json: true
  }
  tools.request(req, tools.wrapResult(next))
}


module.exports = {
  create,
  search,
  get: get,
  save,
  del
}