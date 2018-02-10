'use strict'

const options = require('template-tools/src/utils/options')
const urlparse = require('url').parse
const async = require('async')

const webserverTools = require('../webserver/tools')

const REQUIRED = [
  'client'
]

const DEFAULTS = {
  extractInstallationId: (req) => webserverTools.getIdParam(req, 'installationid')
}


const CrudRoutes = (opts) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const {
    client,
    extractInstallationId,
  } = opts

  // QUERIES
  const list = (req, res, next) => {
    const installationid = extractInstallationId(req)
    client.list({
      installationid
    }, (err, data) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(data || [])
    })
  }

  const get = (req, res, next) => {
    const installationid = extractInstallationId(req)
    const id = req.params.id
    if(!id) return webserverTools.errorReply(next, res, 'id required')
    client.get({
      installationid,
      id,
    }, (err, data) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(data)
    })
  }

  // COMMANDS
  const create = (req, res, next) => {
    const installationid = extractInstallationId(req)
    const data = req.body
    if(!data) return webserverTools.errorReply(next, res, 'no data given', 400)
    client.create({
      installationid,
      data
    }, (err, ret) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(201)
        .json(ret)
    })
  }

  const save = (req, res, next) => {
    const installationid = extractInstallationId(req)
    const data = req.body
    const id = req.params.id
    if(!id) return webserverTools.errorReply(next, res, 'id required')
    if(!data) return webserverTools.errorReply(next, res, 'no data given', 400)
    client.save({
      installationid,
      id,
      data,
    }, (err, ret) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(ret)
    })
  }

  const del = (req, res, next) => {
    const installationid = extractInstallationId(req)
    const id = req.params.id
    if(!id) return webserverTools.errorReply(next, res, 'id required')
    client.del({
      installationid,
      id,
    }, (err, ret) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(ret)
    })
  }

  return {
    list,
    get,
    create,
    save,
    del,
  }
}

module.exports = CrudRoutes