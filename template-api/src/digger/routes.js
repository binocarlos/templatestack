'use strict'

const options = require('../utils/options')
const urlparse = require('url').parse
const async = require('async')

const webserverTools = require('../webserver/tools')
const tools = require('./tools')

const REQUIRED = [
  
]

const DEFAULTS = {
  topic: 'digger',
  extractInstallationId: (req) => webserverTools.getIdParam(req, 'installationid')
}

const DiggerRoutes = (transport, opts) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const TOPIC = opts.topic

  const areResourcesFromDifferentInstallation = (i, resources) => {
    return resources.filter(r => r.installation != i).length > 0
  }

  // QUERIES

  const get = (req, res, next) => {
    const installationid = opts.extractInstallationId(req)
    const id = webserverTools.getIdParam(req, 'id')
    if(!installationid) return webserverTools.errorReply(next, res, 'installationid id required')
    if(!id) return webserverTools.errorReply(next, res, 'resource id required')
    transport.act({
      topic: TOPIC,
      cmd: 'get',
      installationid,
      id
    }, (err, resource) => {
      if(err) return webserverTools.errorReply(next, res, err)
      if(!resource) return webserverTools.errorReply(next, res, 'resource not found', 404)
      if(areResourcesFromDifferentInstallation(installationid, [resource])) return webserverTools.errorReply(next, res, 'wrong installation id', 403)
      res
        .status(200)
        .json(resource)
    })
  }

  const search = (req, res, next) => {
    const installationid = opts.extractInstallationId(req)
    if(!installationid) return webserverTools.errorReply(next, res, 'installationid id required')
    transport.act({
      topic: TOPIC,
      cmd: 'search',
      installationid,
      type: req.qs.type,
      search: req.qs.search
    }, (err, resources) => {
      if(err) return webserverTools.errorReply(next, res, err)
      if(areResourcesFromDifferentInstallation(installationid, resources)) return webserverTools.errorReply(next, res, 'wrong installation id', 403)
      res
        .status(200)
        .json(resources)
    })
  }

  const children = (req, res, next) => {
    const installationid = opts.extractInstallationId(req)
    const id = webserverTools.getIdParam(req, 'id')
    if(!installationid) return webserverTools.errorReply(next, res, 'installationid id required')
    if(!id) return webserverTools.errorReply(next, res, 'resource id required')

    transport.act({
      topic: TOPIC,
      cmd: 'children',
      installationid,
      id,
      withLinks: req.qs.links ? true : false
    }, (err, resources) => {
      if(err) return webserverTools.errorReply(next, res, err)
      if(areResourcesFromDifferentInstallation(installationid, resources)) return webserverTools.errorReply(next, res, 'wrong installation id', 403)
      res
        .status(200)
        .json(resources)
    })
  }

  const descendents = (req, res, next) => {
    const installationid = opts.extractInstallationId(req)
    const id = webserverTools.getIdParam(req, 'id')
    if(!installationid) return webserverTools.errorReply(next, res, 'installationid id required')
    if(!id) return webserverTools.errorReply(next, res, 'resource id required')

    transport.act({
      topic: TOPIC,
      cmd: 'descendents',
      installationid,
      id,
      type: req.qs.type,
      search: req.qs.search,
      withLinks: req.qs.links ? true : false
    }, (err, resources) => {
      if(err) return webserverTools.errorReply(next, res, err)
      if(areResourcesFromDifferentInstallation(installationid, resources)) return webserverTools.errorReply(next, res, 'wrong installation id', 403)
      res
        .status(200)
        .json(resources)
    })
  }

  const links = (req, res, next) => {
    const installationid = opts.extractInstallationId(req)
    const id = webserverTools.getIdParam(req, 'id')
    if(!installationid) return webserverTools.errorReply(next, res, 'installationid id required')
    if(!id) return webserverTools.errorReply(next, res, 'resource id required')

    transport.act({
      topic: TOPIC,
      cmd: 'links',
      installationid,
      id,
      follow: req.qs.follow ? true : false
    }, (err, resources) => {
      if(err) return webserverTools.errorReply(next, res, err)
      if(areResourcesFromDifferentInstallation(installationid, resources)) return webserverTools.errorReply(next, res, 'wrong installation id', 403)
      res
        .status(200)
        .json(resources)
    })
  }

  const create = (req, res, next) => {
    const installationid = opts.extractInstallationId(req)
    const parentid = webserverTools.getIdParam(req, 'id')
    if(!installationid) return webserverTools.errorReply(next, res, 'installationid id required')

    const data = req.body

    transport.act({
      topic: TOPIC,
      cmd: 'create',
      installationid,
      parentid,
      data
    }, (err, result) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(201)
        .json(result)
    })
  }

  const save = (req, res, next) => {
    const installationid = opts.extractInstallationId(req)
    const id = webserverTools.getIdParam(req, 'id')
    if(!installationid) return webserverTools.errorReply(next, res, 'installationid id required')
    if(!id) return webserverTools.errorReply(next, res, 'resource id required')

    const data = req.body

    transport.act({
      topic: TOPIC,
      cmd: 'save',
      installationid,
      id,
      data
    }, (err, result) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(result)
    })
  }

  const del = (req, res, next) => {
    const installationid = opts.extractInstallationId(req)
    const id = webserverTools.getIdParam(req, 'id')
    if(!installationid) return webserverTools.errorReply(next, res, 'installationid id required')
    if(!id) return webserverTools.errorReply(next, res, 'resource id required')

    const data = req.body

    transport.act({
      topic: TOPIC,
      cmd: 'delete',
      installationid,
      id
    }, (err, result) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(result)
    })
  }

  const paste = (req, res, next) => {
    const installationid = opts.extractInstallationId(req)
    const parentid = webserverTools.getIdParam(req, 'id')
    if(!installationid) return webserverTools.errorReply(next, res, 'installationid id required')

    const mode = req.qs.copy ?
      'copy' :
      'cut'

    const ids = (req.qs[mode] || '')
      .split(',')
      .map(id => {
        return parseInt(id.replace(/\D/g, ''))
      })
      .filter(id => isNaN(id) ? false : true)
    
    if(ids.length <= 0 || !mode) return webserverTools.errorReply(next, res, 'no copy or cut ids passed')
      

    const data = req.body

    transport.act({
      topic: TOPIC,
      cmd: 'paste',
      installationid,
      parentid,
      ids,
      mode
    }, (err, result) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(201)
        .json(result)
    })
  }

  const swap = (req, res, next) => {
    const installationid = opts.extractInstallationId(req)
    if(!installationid) return webserverTools.errorReply(next, res, 'installationid id required')

    const source = req.params.target
    const target = req.params.target
    const mode = req.params.mode
  
    if(!source) return next('source id required')
    if(!target) return next('target id required')

    transport.act({
      topic: TOPIC,
      cmd: 'swap',
      installationid,
      source,
      target,
      mode
    }, (err, result) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json(result)
    })
  }


  return {
    get: get,
    search,
    children,
    links,
    descendents,
    create,
    save,
    paste,
    delete: del,
    swap
  }
}

module.exports = DiggerRoutes