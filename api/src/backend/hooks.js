'use strict'

const async = require('async')

const Hooks = (hemera, databases) => {
  const Joi = hemera.exposition['hemera-joi'].joi

  const authRegistered = (user, done) => {
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

  return {
    authRegistered
  }
}

module.exports = Hooks