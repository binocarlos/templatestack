'use strict'

const async = require('async')

const Hooks = (hemera) => {
  const Joi = hemera.exposition['hemera-joi'].joi

  // triggered when a new user registers
  const authRegister = (user, done) => {
    async.series({
      installation: (next) => {
        hemera.act({
          topic: 'installation',
          cmd: 'createDefault',
          userid: user.id
        }, next)
      }
    }, done)
  }

  // triggered when a user account is created by another user
  // this can either be manage installation users or other things like clients who can login
  const authCreate = (user, done) => {
    done()
  }

  const bookingCreate = (booking, done) => done()

  return {
    auth: {
      register: authRegister,
      create: authCreate
    },
    installation: {},
    digger: {},
    booking: {
      create: bookingCreate
    }
  }
}

module.exports = Hooks