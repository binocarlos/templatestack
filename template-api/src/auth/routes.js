'use strict'

const options = require('template-tools/src/utils/options')
const urlparse = require('url').parse
const async = require('async')

const webserverTools = require('../webserver/tools')

const REQUIRED = [
  'client'
]

const DEFAULTS = {
  extractUsername: (req) => req.body.username,
  extractPassword: (req) => req.body.password
}

const AuthRoutes = (opts) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const client = opts.client
  const getUserTags = opts.getUserTags

  // QUERIES
  const status = (req, res) => {
    const user = req.user
    let ret = user ? Object.assign({}, user, {
      tags: getUserTags ? getUserTags(req.user) : {}
    }) : null
    ret = opts.mapUser ? opts.mapUser(ret) : ret
    res
      .status(200)
      .json({
        loggedIn: user ? true : false,
        data: ret
      })
  }

  const exists = (req, res) => {
    const qs = req.qs || {}
    const username = qs.username || ''
    
    client.loadByUsername({
      username,
    }, (err, user) => {
      if(err) return webserverTools.errorReply(next, res, err)
      res
        .status(200)
        .json({
          exists: user ? true : false
        })
    })
  }

  // COMMANDS

  const login = (req, res, next) => {
    const username = opts.extractUsername(req)
    const password = opts.extractPassword(req)

    if(!username) return webserverTools.errorReply(next, res, 'no username given', 400)
    if(!password) return webserverTools.errorReply(next, res, 'no password given', 400)

    client.login({
      username,
      password
    }, (err, user) => {
      if(err) return webserverTools.errorReply(next, res, err)
      if(!user) return webserverTools.errorReply(next, res, err, 403)

      if(user.error) {
        res
          .status(400)
          .json(user)
      }
      else {
        req.login(user, (err) => {
          if(err) return webserverTools.errorReply(next, res, err)
          res
            .status(200)
            .json(user)
        })  
      }
    })
  }

  const register = (req, res, next) => {
    const data = req.body || {}

    const username = opts.extractUsername(req)
    const password = opts.extractPassword(req)

    if(!username) return webserverTools.errorReply(next, res, 'no username given', 400)
    if(!password) return webserverTools.errorReply(next, res, 'no password given', 400)
    client.register({
      username,
      password
    }, (err, user) => {
      if(err) return webserverTools.errorReply(next, res, err)
      if(!user) return webserverTools.errorReply(next, res, err, 400)
      if(user.error) {
        res
          .status(400)
          .json(user)
      }
      else {
        req.login(user, (err) => {
          if(err) return webserverTools.errorReply(next, res, err)
          res
            .status(201)
            .json(user)
        })
      }
    })
  }

  const save = (req, res, next) => {
    if(!req.user) return webserverTools.errorReply(next, res, 'not logged in', 403)
    const id = req.user.id
    const data = req.body || {}

    client.save({
      id,
      data
    }, (err, user) => {
      if(err) return webserverTools.errorReply(next, res, err)
      if(!user) return webserverTools.errorReply(next, res, err, 400)
      let ret = opts.mapUser ? opts.mapUser(user) : user
      res
        .status(200)
        .json(ret)
    })
  }

  const update = (req, res, next) => {
    if(!req.user) return webserverTools.errorReply(next, res, 'not logged in', 403)
    const id = req.user.id
    const data = req.body || {}

    client.update({
      id,
      data
    }, (err, user) => {
      if(err) return webserverTools.errorReply(next, res, err)
      if(!user) return webserverTools.errorReply(next, res, err, 400)

      let ret = opts.mapUser ? opts.mapUser(user) : user
      res
        .status(200)
        .json(ret)
    })
  }

  const logout = (req, res, next) => {
    const redirectTo = urlparse(req.url, true).query.redirect || '/'
    req.session.destroy(function () {
      if(webserverTools.isJSON(req)) {
        res
          .status(200)
          .json({
            loggedIn: false
          })
      }
      else {
        res.redirect(redirectTo)  
      }
      
    })
  }


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


  const googleToken = (req, res, next) => {
    if(req.user) {
      client.googleToken({
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

  const googleRefreshToken = (req, res, next) => {
    if(req.user) {
      client.googleRefreshToken({
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
    status,
    login,
    register,
    update,
    save,
    logout,
    list,
    googleToken,
    googleRefreshToken,
  }
}

module.exports = AuthRoutes