"use strict";
const tape = require('tape')
const async = require('async')
const tools = require('./tools')

const authQueries = require('./queries/auth')
const Queries = require('./queries/collaborations')

const userQueries = Queries('users')

const createCollaborator = (userData, done) => {
  async.waterfall([
    (next) => authQueries.registerAccount(next),

    (user, next) => {
      const i = user.meta.activeInstallation
      userQueries.create(i, userData, (err, result) => {
        if(err) return next(err)
        next(null, {
          statusCode: result.statusCode,
          user,
          collaborator: result.body,
          i
        })
      })
    }
  ], done)
}

tape('collaborations - create user', (t) => {
  const collaboratorData = userQueries.CollaborationData()
  createCollaborator(collaboratorData, (err, result) => {
    if(err) t.error(err)
    t.equal(result.statusCode, 201, 'user created')
    t.equal(result.collaborator.username, collaboratorData.user.username, 'username is correct')
    t.end()
  })
})


tape('collaborations - create user then list', (t) => {
  const collaboratorData = userQueries.CollaborationData()
  async.waterfall([
    (next) => createCollaborator(collaboratorData, next),
    (result, next) => {
      userQueries.list(result.i, next)
    }
  ], (err, result) => {
    if(err) t.error(err)

    const users = result.body
    t.equal(result.statusCode, 200, 'status code 200')
    t.equal(users.length, 2, 'there are 2 users')

    const owner = users.filter(user => user.username != collaboratorData.user.username)[0]
    const collaborator = users.filter(user => user.username == collaboratorData.user.username)[0]

    t.ok(owner.collaboration, 'owner has collaboration')
    t.ok(collaborator.collaboration, 'collaborator has collaboration')
    t.equal(owner.collaboration.type, 'user', 'owner is a user')
    t.equal(collaborator.collaboration.type, 'user', 'collaborator is a user')
    

    t.end()
  })

})


tape('clients - list clients - no installation id', (t) => {

  const collaboratorData = userQueries.CollaborationData()
  async.waterfall([
    (next) => createCollaborator(collaboratorData, next),
    (result, next) => {
      userQueries.list(null, next)
    }
  ], (err, result) => {
    if(err) t.error(err)
    t.equal(result.statusCode, 403, '403 status no installation id')
    t.end()
  })

  
})



tape('clients - save client - no installation id', (t) => {

  const collaboratorData = userQueries.CollaborationData()
  async.waterfall([
    (next) => createCollaborator(collaboratorData, next),
    (results, next) => {
      const client = results.collaborator
      userQueries.save(null, client.id, {}, next)
    }
  ], (err, results) => {
    if(err) t.error(err)
    t.equal(results.statusCode, 403, '403 status no installation id')
    t.end()
  })

  
})


tape('clients - get client', (t) => {

  const collaboratorData = userQueries.CollaborationData()
  async.waterfall([
    (next) => createCollaborator(collaboratorData, next),
    (result, next) => {
      userQueries.get(result.i, result.collaborator.id, next)
    }
  ], (err, result) => {
    if(err) t.error(err)
    t.equal(result.statusCode, 200, '200 statusCode')
    t.equal(result.body.username, collaboratorData.user.username, 'username is correct')
    t.end()
  })

  
})

tape('clients - save client', (t) => {

  const collaboratorData = userQueries.CollaborationData()

  async.waterfall([
    (next) => createCollaborator(collaboratorData, next),
    (results, next) => {
      const client = results.collaborator
      client.meta.pears = 25
      userQueries.save(results.i, client.id, {meta: client.meta}, next)
    }
  ], (err, result) => {
    if(err) t.error(err)

    t.equal(result.statusCode, 200, '200 status')
    t.equal(result.body.meta.pears, 25, 'meta is updated')
    t.equal(result.body.username, collaboratorData.user.username, 'username is correct')


    t.end()
  })

  
})

tape('clients - delete client', (t) => {

  const collaboratorData = userQueries.CollaborationData()
  let createresults = null
  let deleteresults = null

  async.waterfall([
    (next) => createCollaborator(collaboratorData, next),
    (results, next) => {
      async.series({
        list1: (n) => userQueries.list(results.i, n),
        del: (n) => userQueries.del(results.i, results.collaborator.id, n),
        list2: (n) => userQueries.list(results.i, n)
      }, next)
    }
  ], (err, result) => {
    if(err) t.error(err)

    t.equal(result.list1.statusCode, 200, 'list1 200 code')
    t.equal(result.del.statusCode, 200, 'list1 200 code')
    t.equal(result.del.body, "1", 'response from delete')
    t.equal(result.list2.statusCode, 200, 'list1 200 code')

    t.equal(result.list1.body.length, 2, '2 in list 1')
    t.equal(result.list2.body.length, 1, '1 in list 2')
    
    t.end()
  })


  
})

