'use strict'

const options = require('template-tools/src/utils/options')
const urlparse = require('url').parse
const async = require('async')

const webserverTools = require('template-api/src/webserver/tools')

const REQUIRED = [
  'client'
]

const DEFAULTS = {
  
}

const UserRoutes = (opts) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const client = opts.client

  const list  = (req, res, next) => {
    const qs = req.qs || {}
    client.list({
      search: qs.search
    }, (err, users) => {
      if(err) return webserverTools.errorReply(next, res, err)
      users = users || []
      res
        .status(200)
        .json(users)
    })
  }

  const token = (req, res, next) => {
    if(req.user) {
      client.token({
        id: req.user.id
      }, (err, token) => {
        if(err) return webserverTools.errorReply(next, res, err)
        if(!token) {
          res.status(404)
          res.json({
            ok: false
          })
        }
        else {
          res.json({
            ok:true,
            token
          })  
        }
        
      })
    }
    else {
      res.status(404)
      res.json({
        ok: false
      })
    }
  }

  const refreshToken = (req, res, next) => {
    if(req.user) {
      client.refreshToken({
        id: req.user.id
      }, (err, token) => {
        if(err) return webserverTools.errorReply(next, res, err)
        if(!token) {
          res.status(404)
          res.json({
            ok: false
          })
        }
        else {
          res.json({
            ok:true,
            token
          })  
        }
        
      })
    }
    else {
      res.status(404)
      res.json({
        ok: false
      })
    }
  }

  return {
    list,
    token,
    refreshToken
  }
}

module.exports = UserRoutes