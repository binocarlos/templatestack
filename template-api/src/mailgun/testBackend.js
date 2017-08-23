'use strict'
const async = require('async')
const fs = require('fs')
const options = require('template-tools/src/utils/options')
const Mailgun = require('mailgun-js')

const REQUIRED = [
  
]

const REQUIRED_HOOKS = [
  
]

const DEFAULTS = {
  
}

const MailgunTestBackend = (opts) => {
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const hooks = options.processor(opts.hooks, {
    required: REQUIRED_HOOKS
  })

  /*
  
    send

    * from
    * to
    * subject
    * message
    
  */
  const send = (call, done) => {
    done(null, call.request)
  }

  return {
    send
  }
  
}

module.exports = MailgunTestBackend