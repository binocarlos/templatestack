'use strict'

const async = require('async')

const Hooks = (hemera, databases) => {
  const Joi = hemera.exposition['hemera-joi'].joi

  hemera.add({
    topic: 'hook:auth',
    cmd: 'registered',
    user: Joi.object().required()
  }, (req, done) => {
    const user = req.user
    async.series({
      installation: (next) => {
        hemera.act({
          topic: 'installation',
          cmd: 'createDefault',
          userid: user.id
        }, next)
      }
    }, done)
  })
}

module.exports = Hooks