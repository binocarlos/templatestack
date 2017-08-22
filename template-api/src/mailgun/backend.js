'use strict'
const async = require('async')
const options = require('template-tools/src/utils/options')
const Mailgun = require('mailgun-js')

const REQUIRED = [
  'apiKey',
  'domain'
]

const REQUIRED_HOOKS = [
  
]

const DEFAULTS = {
  
}

const MailgunBackend = (opts) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const hooks = options.processor(opts.hooks, {
    required: REQUIRED_HOOKS
  })

  const mailgun = Mailgun({
    apiKey: opts.apiKey,
    domain: opts.domain
  })

  /*
  
    send

    * from
    * to
    * subject
    * message
    
  */
  const send = (call, done) => {
    if(opts.testHandler) {
      done(null, opts.testHandler(call.request))
    }
    else {
      mailgun.messages().send({
        from: call.request.from,
        to: call.request.to,
        subject: call.request.subject,
        text: call.request.content
      }, done)  
    }
  }

  return {
    send
  }

}

module.exports = MailgunBackend