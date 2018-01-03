'use strict'

const options = require('template-tools/src/utils/options')
const urlparse = require('url').parse
const async = require('async')

const webserverTools = require('../webserver/tools')
const tools = require('./tools')

const REQUIRED = [
  'client'
]

const DEFAULTS = {
  extractInstallationId: (req) => webserverTools.getIdParam(req, 'installationid')
}

const DiggerRoutes = (opts) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const client = opts.client

  const areResourcesFromDifferentInstallation = (i, resources) => {
    return resources.filter(r => r.installation != i).length > 0
  }

  // QUERIES

  const get = (req, res, next) => {
    const installationid = opts.extractInstallationId(req)
    const id = webserverTools.getIdParam(req, 'id')
    if(!installationid) return webserverTools.errorReply(next, res, 'installationid id required')
    if(!id) return webserverTools.errorReply(next, res, 'resource id required')
    client.loadById({
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
    client.search({
      installationid,
      type: req.qs.type,
      search: req.qs.search,
      namespace: req.qs.namespace,
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
    
    client.children({
      installationid,
      id,
      type: req.qs.type,
      search: req.qs.search,
      namespace: req.qs.namespace,
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
    //if(!id) return webserverTools.errorReply(next, res, 'resource id required')

    client.descendents({      
      installationid,
      id,
      type: req.qs.type,
      search: req.qs.search,
      namespace: req.qs.namespace,
      withLinks: req.qs.links ? true : false,
      tree: req.qs.tree ? true : false,
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

    client.links({
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

    client.create({
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

    client.save({
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

    client.del({
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

    client.paste({
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

    const source = req.params.source
    const target = req.params.target
    const mode = req.params.mode
  
    if(!source) return next('source id required')
    if(!target) return next('target id required')

    client.swap({
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