'use strict'
const async = require('async')
const fs = require('fs')
const options = require('template-tools/src/utils/options')
const Mailgun = require('mailgun-js')

const REQUIRED = [
  'filepath'
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

  let messages = []

  const saveMessages = () => {
    console.log('-------------------------------------------');
    console.log('-------------------------------------------');
    console.log('saving email messages')
    console.log(opts.filepath)
    console.log(JSON.stringify(messages, null, 4))
    fs.writeFileSync(opts.filepath, JSON.stringify(messages), 'utf8')
  }

  /*
  
    send

    * from
    * to
    * subject
    * message
    
  */
  const send = (call, done) => {
    messages.push(call.request)
    saveMessages()
    done(null, messages)
  }

  return {
    send
  }
  
}

module.exports = MailgunTestBackend