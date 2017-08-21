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
  topic: 'email'
}

const MailgunBackend = (hemera, opts) => {
  let Joi = hemera.exposition['hemera-joi'].joi

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

  const TOPIC = opts.topic

  /*
  
    send

    * from
    * to
    * subject
    * message
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'send',
    from: Joi.string().required(),
    to: Joi.string().required(),
    subject: Joi.string().required(),
    content: Joi.string().required()
  }, (req, done) => {
    if(opts.testHandler) {
      done(null, opts.testHandler(req))
    }
    else {
      mailgun.messages().send({
        from: req.from,
        to: req.to,
        subject: req.subject,
        text: req.content
      }, done)  
    }
    
  })

}

module.exports = MailgunBackend