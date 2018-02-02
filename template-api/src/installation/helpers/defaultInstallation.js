'use strict'

const async = require('async')

const DefaultInstallation = (opts = {}) => {

  const getClients = opts.getClients

  const create = (user, done) => {
    const clients = getClients()

    async.waterfall([
      (next) => {
        clients.installation.create({
          data: {
            name: opts.defaultTitle || "Default Company",
            collaborators: [{
              id: user.id,
              collaboration_permission: 'owner'
            }]
          },
          userid: user.id
        }, next)
      },

      (installation, next) => {
        clients.auth.update({
          id: user.id,
          data: {
            activeInstallationId: installation.id
          }
        }, next)
      }
    ], done)
    
  }
  
  return {
    create,
  }
}

module.exports = DefaultInstallation