'use strict'
const async = require('async')
const options = require('template-tools/src/utils/options')
const Stripe = require('stripe')

const REQUIRED = [
  'secretKey'
]

const REQUIRED_HOOKS = [
  
]

const DEFAULTS = {
  topic: 'stripe'
}

const StripeBackend = (hemera, opts) => {
  let Joi = hemera.exposition['hemera-joi'].joi

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const hooks = options.processor(opts.hooks, {
    required: REQUIRED_HOOKS
  })

  const stripe = Stripe(opts.secretKey)
  const TOPIC = opts.topic

  /*
  
    testToken

  */
  hemera.add({
    topic: TOPIC,
    cmd: 'testToken'
  }, (req, done) => {
    // + 2 months
    const nowDate = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 60))
    const year = nowDate.getFullYear()
    const month = nowDate.getMonth() + 1
    stripe.tokens.create({
      card: {
        "number": '4242424242424242',
        "exp_month": month,
        "exp_year": year,
        "cvc": '123'
      }
    }, done)
  })

  /*
  
    payment

    returns {
      ok: bool,
      error: 'desc'
    }

    if an actual error is returned it is a lower level system error (like cannot connect to remote api etc)
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'payment',
    amount: Joi.number().required(),
    email: Joi.string().required(),
    token: Joi.string().required(),
    description: Joi.string().required()
  }, (req, done) => {
    stripe.charges.create({
      amount: req.amount,
      currency: "gbp",
      receipt_email: req.email,
      source: req.token,
      description: req.description
    }, (err, result) => {
      if(err) return done(null, {
        ok: false,
        error: err.toString()
      })
      if(!result) return done(null, {
        ok: false,
        error: 'no payment result found'
      })
      done(null, {
        ok: true,
        charge: result
      })
    })
  })

}

module.exports = StripeBackend