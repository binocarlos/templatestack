'use strict'
  
const async = require('async')
const options = require('template-tools/src/utils/options')
const OptionsDriver = require('shared/src/options/driver')
const SlotDriver = require('shared/src/slot/driver')
const bookingSelectors = require('shared/src/booking/selectors')
const dayTools = require('shared/src/day/tools')
const idTools = require('template-tools/src/utils/id')
const dateTools = require('template-tools/src/utils/date')

const emailMessage = require('../utils/email')
const smsMessage = require('../utils/sms')

const models = require('./models')
const config = require('../config')
const settings = require('../settings')

const getConfig = (type, section) => {
  const typeConfig = config[type]
  if(!section) return typeConfig
  return typeConfig[section]
}

const REQUIRED = [
  'hooks'
]

const REQUIRED_HOOKS = [
  'bookingRange',
  'bookingCreate',
  'bookingSave',
  'bookingDelete',
  'stripeTestToken',
  'stripePayment',
  'emailSend',
  'smsSend'
]

const DEFAULTS = {

}

const appError = (err) => ({
  ok: false,
  error: err
})

const BookingSubmitBackend = (opts) => {
  
  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const hooks = options.processor(opts.hooks, {
    required: REQUIRED_HOOKS
  })

  /*
  
    getToken
    
  */
  const getStripeToken = (booking, done) => {
    const bookingPayment = bookingSelectors.payment(booking)
    let token = bookingPayment.token

    // we have an actual token
    if(token) {
      return done(null, token)
    }

    // we are in test mode
    if(bookingPayment.mode == 'stripe_test' && settings.run_mode == 'development') {
      hooks.stripeTestToken({}, (err, t) => {
        if(err) return done(err) 
        done(null, t)
      })
    }
    // this is for testing bad tokens
    else if(bookingPayment.mode == 'stripe_test_bad' && settings.run_mode == 'development') {
      hooks.stripeTestToken({}, (err, t) => {
        if(err) return done(err)
        t.id = t.id + 'BAD'
        done(null, t)  
      })
    }
    else{
      return done('no payment token found')
    }
  }

  /*
  
    processPayment
    
  */
  const chargeStripeCard = (booking, token, customerEmail, done) => {
    const typeConfig = getConfig(booking.type)
    const optionsDriver = OptionsDriver(booking.type)
    const paymentConfig = typeConfig.payment
    const optionConfig = typeConfig.options
    const prices = bookingSelectors.prices(booking)
    const options = bookingSelectors.options(booking)
    const calculatedFields = optionsDriver.calculate(options, optionConfig, prices)

    const total = optionsDriver.total(calculatedFields)
    const paymentTotal = optionsDriver.paymentAmount(total, paymentConfig)

    const description = paymentConfig.subject + ' - ' + booking.booking_reference

    hooks.stripePayment({
      amount: paymentTotal,
      email: customerEmail,
      token: token.id,
      description
    }, (err, result) => {
      if(err) return done(err)
      if(!result) return done('no payment result found')
      if(!result.ok) return done(result.error)
      done(null, {
        token,
        amount: paymentTotal,
        charge: result.charge
      })
    })
  }

  const processStripePayment = (booking, customerEmail, done) => {
    async.waterfall([
      (next) => getStripeToken(booking, next),
      (token, next) => {
        chargeStripeCard(booking, token, customerEmail, (err, payment) => {
          if(err) return next(err)
          const bookingPayment = bookingSelectors.payment(booking)
          bookingPayment.mode = 'stripe'
          bookingPayment.amount = payment.amount
          bookingPayment.token = payment.token
          bookingPayment.charge = payment.charge
          bookingPayment.timestamp = dateTools.timestamp()
          next()
        })
      }
    ], done)
  }

  const sendEmail = (booking, done) => {
    const emailPayload = emailMessage(booking)
    if(!emailPayload) return done()
    const allEmails = [emailPayload.to].concat(settings.admin_emails || [])
    async.parallel(allEmails.map(toEmail => next => {
      hooks.emailSend({
        from: emailPayload.from,
        to: toEmail,
        subject: emailPayload.subject,
        content: emailPayload.content
      }, next)
    }), (err, results) => {
      if(err) return done(err)
      if(!results) return done()
      return done(null, results[0])
    })
  }

  const sendSms = (booking, done) => {
    const smsPayload = smsMessage(booking)
    if(!smsPayload) return done()

    hooks.smsSend({
      from: smsPayload.from,
      to: smsPayload.to,
      content: smsPayload.content
    }, done)
  }

  const sendCommunications = (booking, opts, done) => {
    async.parallel({
      email: (next) => {
        if(opts.email) {
          sendEmail(booking, next)
        }
        else {
          next()
        }
      },
      sms: (next) => {
        if(opts.sms) {
          sendSms(booking, next)
        }
        else {
          next()
        }
      }
    }, done)
  }

  const validateBookingOptions = (booking) => {
    const type = booking.type
    const optionDriver = OptionsDriver(type)
    const options = bookingSelectors.options(booking)
    const validateErrors = optionDriver.validate(options)
    return Object.keys(validateErrors || {}).length > 0 ? 
      {
        ok: false,
        error: Object.keys(validateErrors || {}).map(key => `${key}: ${validateErrors[key]}`).join(' - ')
      }
      :
      null
  }

  const loadSlot = (installationid, booking, done) => {
    const rangeReq = {
      installationid,
      type: booking.type,
      start: booking.date,
      end: booking.date
    }
    hooks.bookingRange(rangeReq, (err, days) => {
      if(err) return done(err)
      const day = days[0]
      if(!day) return done(new Error('no day found'))
      const slot = dayTools.getSlot(day, booking.slot)
      done(null, slot)
    })
  }

  const isSlotBlocked = (slot) => (slot._items || []).filter(booking => booking.meta.blocked).length > 0

  const canBookSlot = (booking, slot) => {
    const slotDriver = SlotDriver(booking.type)
    if(isSlotBlocked(slot)) return false
    return slotDriver.canAddBooking(slot, booking)
  }

  const isSlotEmpty = (slot) => (slot._items || []).length <= 0



  /*
  
    check

      * installationid    
      * data
        * date
        * type
        * slot
        * meta
    
  */
  const check = (call, done) => {
    const req = call.request
    const booking = req.data

    const errors = validateBookingOptions(booking)
    if(errors) return done(null, errors)

    loadSlot(req.installationid, booking, (err, slot) => {
      if(err) return done(err)
      console.log(JSON.stringify(slot, null, 4))
      if(!canBookSlot(booking, slot)) {
        return done(null, {
          ok: false,
          error: 'there is no space left for this booking'
        })
      }
      const returnSlot = Object.assign({}, slot)
      delete(slot._items)
      done(null, {
        ok: true,
        slot
      })
    })
  }


  /*
  
    slot

      * installationid
      * date
      * slot
      * type
      
    
  */
  const slot = (call, done) => {
    const req = call.request
    const booking = req.data

    loadSlot(req.installationid, req, (err, slot) => {
      if(err) return done(err)
      done(null, {
        ok: true,
        slot
      })
    })
  }

  /*
  
    block

      * installationid
      * data
          * date
          * type
          * slot
    
  */
  const block = (call, done) => {
    const req = call.request
    const booking = req.data
    let context = {}

    async.series([

      // check that the slot is open - we cannot block a booked slot
      (next) => {
        loadSlot(req.installationid, booking, (err, slot) => {
          if(err) return next(err)
          if(!isSlotEmpty(slot)) {
            return done(null, {
              ok: false,
              error: 'you cannot block a slot that has an existing booking'
            })
          }
          context.slot = slot
          next()
        })
      },

      (next) => {

        const blockedBooking = bookingSelectors.blockedBooking(booking, context.slot)
        hooks.bookingCreate({
          installationid: req.installationid,
          data: blockedBooking
        }, (err, result) => {
          if(err) return next(err)
          if(!result) return next('no booking created')
          context.booking = result
          next()
        })
      }

    ], err => {
      if(err) return done(err)
      done(null, {
        ok: true,
        booking: context.booking
      })
    })
  }


  /*
  
    unblock

      * installationid
      * data
          * date
          * type
          * slot
    
  */
  const unblock = (call, done) => {
    const req = call.request
    const booking = req.data
    let context = {}

    booking.date = dateTools.sqlDate(booking.date, true)

    async.series([

      // check that the slot is open - we cannot block a booked slot
      (next) => {
        loadSlot(req.installationid, booking, (err, slot) => {
          if(err) return next(err)
          if(isSlotEmpty(slot)) {
            return done(null, {
              ok: false,
              error: 'you cannot unblock an empty slot'
            })
          }
          if(!isSlotBlocked(slot)) {
            return done(null, {
              ok: false,
              error: 'you cannot unblock an non blocked slot'
            })
          }
          context.slot = slot
          context.booking = slot._items.filter(booking => booking.meta.blocked)[0]
          next()
        })
      },

      (next) => {
        hooks.bookingDelete({
          installationid: req.installationid,
          id: context.booking.id
        }, (err) => {
          if(err) return next(err)
          next()
        })
      }

    ], err => {
      if(err) return done(err)
      done(null, {
        ok: true
      })
    })
  }
  

  /*
  
    submit

      * installationid
      * data
          * date
          * type
          * slot
          * meta
    
  */
  const submit = (call, done) => {
    const req = call.request
    let context = {}

    const booking = req.data
    booking.booking_reference = idTools.makeid()

    const info = bookingSelectors.info(booking)

    const customerEmail = info.email
    const customerPhone = info.mobile

    const typeConfig = getConfig(req.data.type)

    async.series([

      (next) => {
        check({
          request: req
        }, (err, result) => {
          if(err) return done(err)
          if(!result.ok) return done(null, result)
          let slot = result.slot
          delete(slot._items)
          booking.meta.slot = slot
          next()
        })
      },

      (next) => processStripePayment(booking, customerEmail, next),

      (next) => {
        hooks.bookingCreate({
          installationid: req.installationid,
          data: booking
        }, (err, result) => {
          if(err) return next(err)
          if(!result) return next('no booking created')
          context.booking = result
          next()
        })
      },

      (next) => {
        sendCommunications(booking, {
          email: true,
          sms: true
        }, (err, results) => {
          if(err) return next(err)
          context.comResults = results
          next()
        })
      }

    ], err => {
      if(err) return done(err)
      done(null, {
        ok: true,
        result: {
          booking: context.booking,
          email: context.comResults.email,
          sms: context.comResults.sms
        }
      })
    })
  }

  /*
  
    create - admin

      * installationid
      * data
        * communication
          * sms
          * email
        * booking
          * date
          * type
          * slot
          * meta
    
  */
  const create = (call, done) => {
    const req = call.request
    let context = {}

    const { booking, communication } = req.data
    const { sms, email } = communication

    booking.booking_reference = idTools.makeid()

    const info = bookingSelectors.info(booking)

    const customerEmail = info.email
    const customerPhone = info.mobile

    const typeConfig = getConfig(req.data.type)

    async.series([

      (next) => {
        check({
          request: {
            installationid: req.installationid,
            data: booking
          }
        }, (err, result) => {
          if(err) return done(err)
          if(!result.ok) return done(null, result)
          let slot = result.slot
          delete(slot._items)
          booking.meta.slot = slot
          next()
        })
      },

      (next) => {
        hooks.bookingCreate({
          installationid: req.installationid,
          data: booking
        }, (err, result) => {
          if(err) return next(err)
          if(!result) return next('no booking created')
          context.booking = result
          next()
        })
      },

      (next) => {
        sendCommunications(booking, {
          email,
          sms
        }, (err, results) => {
          if(err) return next(err)
          context.comResults = results
          next()
        })
      }

    ], err => {
      if(err) return done(err)
      done(null, {
        ok: true,
        result: {
          booking: context.booking,
          email: context.comResults.email,
          sms: context.comResults.sms
        }
      })
    })
  }


  /*
  
    save - admin

      * installationid
      * id
      * data
        * communication
          * sms
          * email
        * booking
          * date
          * type
          * slot
          * meta
    
  */
  const save = (call, done) => {
    const req = call.request

    let context = {}

    const id = req.id
    const { booking, communication } = req.data
    const { sms, email } = communication

    const info = bookingSelectors.info(booking)

    const customerEmail = info.email
    const customerPhone = info.mobile

    const typeConfig = getConfig(req.data.type)

    delete(booking.meta.slot._items)

    async.series([


      (next) => {
        hooks.bookingLoad({
          installationid: req.installationid,
          id
        }, (err, result) => {
          if(err) return next(err)
          if(!result) return next('no booking found')
          next()
        })
      },

      (next) => {
        hooks.bookingSave({
          installationid: req.installationid,
          id: booking.id,
          data: booking
        }, (err, result) => {
          if(err) return next(err)
          if(!result) return next('no booking saved')
          context.booking = result
          next()
        })
      },

      (next) => {
        sendCommunications(booking, {
          email,
          sms
        }, (err, results) => {
          if(err) return next(err)
          context.comResults = results
          next()
        })
      }

    ], err => {
      if(err) return done(err)
      done(null, {
        ok: true,
        result: {
          booking: context.booking,
          email: context.comResults.email,
          sms: context.comResults.sms
        }
      })
    })
  }

  return {
    check,
    block,
    slot,
    unblock,
    submit,
    create,
    save
  }
}

module.exports = BookingSubmitBackend