'use strict'
const async = require('async')
const fs = require('fs')
const options = require('template-tools/src/utils/options')

const REQUIRED = [
  'filepath'  
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

  const saveMessages = () => {
    console.log('-------------------------------------------');
    console.log('-------------------------------------------');
    console.log('saving sms messages')
    console.log(opts.filepath)
    console.log(JSON.stringify(messages, null, 4))
    fs.writeFileSync(opts.filepath, JSON.stringify(messages), 'utf8')
  }

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
    saveMessages()
    done(null, messages)
  })

}

module.exports = TwilioTestBackend