'use strict'
const async = require('async')
const options = require('template-tools/src/utils/options')

const REQUIRED = [
  
]

const REQUIRED_HOOKS = [
  
]

const DEFAULTS = {
  topic: 'sms'
}

const TwilioTestBackend = (hemera, opts) => {
  let Joi = hemera.exposition['hemera-joi'].joi

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const hooks = options.processor(opts.hooks, {
    required: REQUIRED_HOOKS
  })

  const TOPIC = opts.topic
  let messages = []
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
    messages.push(req)
    done(null, messages)
  })

}

module.exports = TwilioTestBackend