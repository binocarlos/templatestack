'use strict'

const options = require('template-tools/src/utils/options')
const config = require('../config')

const REQUIRED = [
  'client'
]

const DEFAULTS = {
  
}

const BookingSubmitRoutes = (opts) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const client = opts.client

  const check = (req, res, next) => {
    const installationid = req.installationid
    const data = req.body
    
    client.check({
      installationid,
      data
    }, (err, result) => {
      if(err || !result.ok) {
        res
          .status(400)
          .json({
            ok: false,
            error: err ? err.toString() : result.error
          })
      }
      else {
        res
          .status(200)
          .json({
            ok: result.ok,
            slot: result.slot
          })  
      }
    })
  }

  const submit = (req, res, next) => {
    const installationid = req.installationid
    const data = req.body
    
    client.submit({
      installationid,
      data
    }, (err, result) => {
      if(err || !result.ok) {
        res
          .status(400)
          .json({
            ok: false,
            error: err ? err.toString() : result.error
          })
      }
      else {
        res
          .status(201)
          .json(result)
      }
    })
  }

  const slot = (req, res, next) => {
    const installationid = req.installationid
    const data = req.body
    
    client.slot({
      installationid,
      type: req.params.type,
      date: req.params.date,
      slot: req.params.slot
    }, (err, result) => {
      if(err || !result.ok) {
        res
          .status(400)
          .json({
            ok: false,
            error: err ? err.toString() : result.error
          })
      }
      else {
        res
          .status(200)
          .json(result)
      }
    })
  }

  const block = (req, res, next) => {
    const installationid = req.installationid
    const data = req.body
    
    client.block({
      installationid,
      data
    }, (err, result) => {
      if(err || !result.ok) {
        res
          .status(400)
          .json({
            ok: false,
            error: err ? err.toString() : result.error
          })
      }
      else {
        res
          .status(201)
          .json(result)
      }
    })
  }

  const unblock = (req, res, next) => {
    const installationid = req.installationid
    const data = req.body
    
    client.unblock({
      installationid,
      data
    }, (err, result) => {
      if(err || !result.ok) {
        res
          .status(400)
          .json({
            ok: false,
            error: err ? err.toString() : result.error
          })
      }
      else {
        res
          .status(200)
          .json(result)
      }
    })
  }

  const save = (req, res, next) => {
    const installationid = req.installationid
    const data = req.body
    const id = req.params.id

    client.save({
      installationid,
      id,
      data
    }, (err, result) => {
      if(err || !result.ok) {
        res
          .status(400)
          .json({
            ok: false,
            error: err ? err.toString() : result.error
          })
      }
      else {
        res
          .status(200)
          .json(result)
      }
    })
  }

  const create = (req, res, next) => {
    const installationid = req.installationid
    const data = req.body
    
    client.create({
      installationid,
      data
    }, (err, result) => {
      if(err || !result.ok) {
        res
          .status(400)
          .json({
            ok: false,
            error: err ? err.toString() : result.error
          })
      }
      else {
        res
          .status(201)
          .json(result)
      }
    })
  }

  return {
    check,
    submit,
    slot,
    block,
    unblock,
    save,
    create
  }
}

module.exports = BookingSubmitRoutes