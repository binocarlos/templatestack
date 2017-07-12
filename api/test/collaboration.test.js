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

/*



tape('clients - delete client', (t) => {

  let createresults = null
  let deleteresults = null
  async.waterfall([
    createClient,
    (results, next) => {
      const client = results.client.body
      const clientid = client.id
      delete(client.id)
      createresults = results
      tools.deleteClient(createresults.installationid, clientid, next)
    },
    (results, next) =>  {
      deleteresults = results
      next(null, deleteresults)
    },
    (deleteresults, next) => tools.listClients(createresults.installationid, next)
  ], (err, listresults) => {
    if(err) t.error(err)

    t.equal(listresults.statusCode, 200, '200 status code for list')
    t.equal(deleteresults.statusCode, 200, '200 status code for deleteresults')
    t.equal(listresults.body.length, 0, 'no clients in list')

    t.end()
  })

  
})

tape('clients - cross installation get client', (t) => {

  const userData1 = tools.UserData('bob1')
  const userData2 = tools.UserData('bob2')

  let users = null

  async.waterfall([

    (next) => {
      async.series({
        user1: (unext) => createClient(userData1, unext),
        user2: (unext) => createClient(userData2, unext)
      }, next)
    },

    (results, next) => {
      const installationid1 = results.user1.user.body.data.meta.activeInstallation
      const installationid2 = results.user2.user.body.data.meta.activeInstallation
      const clientid1 = results.user1.client.body.id
      const clientid2 = results.user2.client.body.id

      users = {
        installationid1,
        installationid2,
        clientid1,
        clientid2
      }

      tools.login(userData1, next)
    },

    (login, next) => {

      async.series({
        canaccess: (nexts) => tools.getClient(users.installationid1, users.clientid1, nexts),
        cantaccess: (nexts) => tools.getClient(users.installationid1, users.clientid2, nexts),
      }, next)

    }

  ], (err, results) => {
    if(err) t.error(err)

    t.equal(results.canaccess.statusCode, 200, '200 can access')
    t.equal(results.cantaccess.statusCode, 403, '403 cant access')

    t.end()
  })

  
})


tape('clients - cross installation save client', (t) => {

  const userData1 = tools.UserData('bob1')
  const userData2 = tools.UserData('bob2')

  let users = null

  async.waterfall([

    (next) => {
      async.series({
        user1: (unext) => createClient(userData1, unext),
        user2: (unext) => createClient(userData2, unext)
      }, next)
    },

    (results, next) => {
      const installationid1 = results.user1.user.body.data.meta.activeInstallation
      const installationid2 = results.user2.user.body.data.meta.activeInstallation
      const clientid1 = results.user1.client.body.id
      const clientid2 = results.user2.client.body.id

      const client1 = results.user1.client.body
      const client2 = results.user1.client.body

      client1.meta.fruit = 'oranges'
      client2.meta.fruit = 'oranges'

      users = {
        installationid1,
        installationid2,
        clientid1,
        clientid2,
        client1,
        client2
      }

      tools.login(userData1, next)
    },

    (login, next) => {

      async.series({
        canaccess: (nexts) => tools.saveClient(users.installationid1, users.clientid1, users.client1, nexts),
        cantaccess: (nexts) => tools.saveClient(users.installationid1, users.clientid2, users.client2, nexts),
      }, next)

    }

  ], (err, results) => {
    if(err) t.error(err)

    t.equal(results.canaccess.statusCode, 200, '200 can access')
    t.equal(results.cantaccess.statusCode, 403, '403 cant access')

    t.end()
  })

  
})

*/