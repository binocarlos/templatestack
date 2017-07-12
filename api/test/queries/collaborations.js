"use strict";
const async = require('async')

const tools = require('../tools')

const CollaborationData = (permission, count) => {
  count = count || ''
  permission = permission || 'editor'
  const ts = new Date().getTime()
  return {
    user: {
      username: 'client' + ts + count + '@test.com',
      password: 'apples',
      meta: {
        name: 'test client ' + ts + count
      }  
    },
    collaboration: {
      permission
    }
  }
}

const CollaborationQueries = (path) => {

  const createUser = (userData, done) => {
    userData = userData || CollaborationData()
    
  }
  const create = (i, data, next) => {
    const req = {
      method: 'POST',
      url: tools.url(`/i/${i}/${path}`),
      json: data
    }
    tools.request(req, tools.wrapResult(next)) 
  }

  const list = (i, next) => {
    const req = {
      method: 'GET',
      url: tools.url(`/i/${i}/${path}`),
      json: true
    }
    tools.request(req, tools.wrapResult(next)) 
  }

  const get = (i, id, next) => {
    const req = {
      method: 'GET',
      url: tools.url(`/i/${i}/${path}/${id}`),
      json: true
    }
    tools.request(req, tools.wrapResult(next)) 
  }

  const save = (i, id, data, next) => {
    const req = {
      method: 'PUT',
      url: tools.url(`/i/${i}/${path}/${id}`),
      json: data
    }
    tools.request(req, tools.wrapResult(next))
  }

  const del = (i, id, next) => {
    const req = {
      method: 'DELETE',
      url: tools.url(`/i/${i}/${path}/${id}`)
    }
    tools.request(req, tools.wrapResult(next))
  }

  return {
    CollaborationData,
    create,
    list,
    get,
    save,
    del
  }
}

module.exports = CollaborationQueries