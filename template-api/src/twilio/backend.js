'use strict'
const async = require('async')
const options = require('template-tools/src/utils/options')
const Twilio = require('twilio')

const REQUIRED = [
  'sid',
  'token'
]

const REQUIRED_HOOKS = [
  
]

const DEFAULTS = {

}

const TwilioBackend = (opts) => {
  
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const hooks = options.processor(opts.hooks, {
    required: REQUIRED_HOOKS
  })

  const client = Twilio(
    opts.sid,
    opts.token
  )

  /*
  
    send

    * from
    * to
    * message
    
  */
  const send = (call, done) => {
    if(opts.testHandler) {
      done(null, opts.testHandler(call.request))
    }
    else {
      client.messages.create({
        from: call.request.from,
        to: call.request.to,
        body: call.request.content
      }, (err, res) => {
        if(err) return done(err)
        done(null, {
          ok: true,
          status: res.status,
          uri: res.uri,
          from: res.from,
          to: res.to,
          body: res.body
        })
      })  
    }
  }

  return {
    send
  }

}

module.exports = TwilioBackend