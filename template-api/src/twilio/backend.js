'use strict'
const async = require('async')
const Twilio = require('twilio')

const REQUIRED = [
  'sid',
  'token'
]

const REQUIRED_HOOKS = [
  
]

const DEFAULTS = {
  topic: 'sms'
}

const TwilioBackend = (hemera, opts) => {
  let Joi = hemera.exposition['hemera-joi'].joi

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const hooks = options.processor(opts.hooks, {
    required: REQUIRED_HOOKS
  })

  const TOPIC = opts.topic
  const twilio = Twilio(
    opts.sid,
    opts.token
  )

  /*
  
    send

    * from
    * to
    * message
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'send',
    from: Joi.string().required(),
    to: Joi.string().required(),
    content: Joi.string().required()
  }, (req, done) => {
    if(opts.testHandler) {
      done(null, opts.testHandler(req))
    }
    else {
      client.messages.create({
        from: req.from,
        to: req.to,
        body: req.content
      }, done)  
    }
    
  })

}

module.exports = TwilioBackend