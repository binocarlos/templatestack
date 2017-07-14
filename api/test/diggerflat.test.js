"use strict";

const tape = require('tape')
const async = require('async')
const tools = require('./tools')
const authQueries = require('./queries/auth')
const queries = require('./queries/digger')

const FIXTURES = require('./fixtures/digger.json')
const NODE = FIXTURES.resourceNode
const TYPENODES = FIXTURES.resourceTypes
const TREE = FIXTURES.resourceTree


const createSingleResource = (userData, data, done) => {
  async.waterfall([
    (next) => authQueries.register(userData, next),

    (user, next) => {
      user = user.body      
      const i = user.meta.activeInstallation
      queries.create(i, data, (err, result) => {
        if(err) return next(err)
        next(null, {
          statusCode: result.statusCode,
          user,
          resource: result.body,
          i
        })
      })
    }
  ], done)
}


tape('resourceflat - create resource', (t) => {
  const userData = authQueries.UserData()

  createSingleResource(userData, NODE, (err, base) => {

    t.equal(base.statusCode, 201, '201 status')
    t.equal(base.resource.name, NODE.name, 'resource name')
    t.equal(base.resource.meta.price, NODE.meta.price, 'resource meta')

    t.end()
  })
})

tape('resourceflat - get resource', (t) => {
  const userData = authQueries.UserData()

  createSingleResource(userData, NODE, (err, base) => {

    queries.get(base.i, base.resource.id, {}, (err, results) => {

      t.equal(results.statusCode, 200, '200 code')
      t.equal(results.body.name, NODE.name, 'resource name')
      
      t.end()
    })

  })
})

tape('resourceflat - search resources', (t) => {
  const userData = authQueries.UserData()

  createSingleResource(userData, NODE, (err, base) => {

    queries.search(base.i, {}, (err, results) => {

      t.equal(results.statusCode, 200, '200 code')
      t.equal(results.body[0].name, NODE.name, 'resource name')
      
      t.end()
    })

  })
})

tape('resourceflat - search - no installation id', (t) => {
  const userData = authQueries.UserData()

  createSingleResource(userData, NODE, (err, base) => {

    queries.search(null, {}, (err, results) => {

      t.equal(results.statusCode, 403, '403 status no installation id')
      
      t.end()
    })

  })
})


tape('resourceflat - save resource', (t) => {

  const userData = authQueries.UserData()

  createSingleResource(userData, NODE, (err, base) => {

    let resource = base.resource
    const resourceid = resource.id
    delete(resource.id)

    resource.meta.height = 20

    queries.save(base.i, resourceid, resource, (err, results) => {

      t.equal(results.statusCode, 200, '200 code')
      t.equal(results.body.meta.height, 20, 'resource updated')
      
      t.end()
    })

  })

})


tape('resourceflat - save resource - no installation id', (t) => {

  const userData = authQueries.UserData()

  createSingleResource(userData, NODE, (err, base) => {

    let resource = base.resource
    const resourceid = resource.id
    delete(resource.id)

    resource.meta.height = 20

    queries.save(null, resourceid, resource, (err, results) => {

      t.equal(results.statusCode, 403, '403 status no installation id')
      
      t.end()
    })

  })

  
})


tape('resourceflat - delete resource', (t) => {

  const userData = authQueries.UserData()

  let createresults = null
  let deleteresults = null
  async.waterfall([
    (next) => createSingleResource(userData, NODE, next),
    (base, next) => {
      const resource = base.resource
      const resourceid = resource.id
      createresults = base
      queries.del(base.i, resourceid, next)
    },
    (results, next) =>  {
      deleteresults = results
      next(null, deleteresults)
    },
    (deleteresults, next) => queries.search(createresults.i, {}, next)
  ], (err, delresults) => {
    if(err) t.error(err)

    t.equal(delresults.statusCode, 200, '200 code')
    t.equal(delresults.body.length, 0, 'no resources in list')

    t.end()
  })

  
})


tape('resourceflat - cross installation get resource', (t) => {

  const userData1 = authQueries.UserData('bob1')
  const userData2 = authQueries.UserData('bob2')

  let users = null

  async.waterfall([

    (next) => {
      async.series({
        user1: (unext) => createSingleResource(userData1, NODE, unext),
        user2: (unext) => createSingleResource(userData2, NODE, unext)
      }, next)
    },

    (results, next) => {
      const installationid1 = results.user1.user.meta.activeInstallation
      const installationid2 = results.user2.user.meta.activeInstallation
      const resourceid1 = results.user1.resource.id
      const resourceid2 = results.user2.resource.id

      users = {
        installationid1,
        installationid2,
        resourceid1,
        resourceid2
      }

      authQueries.logout(err => {
        if(err) return next(err)
        authQueries.login(userData1, next)
      })
    },

    (login, next) => {

      async.series({
        canaccess: (nexts) => queries.get(users.installationid1, users.resourceid1, {}, nexts),
        cantaccess: (nexts) => queries.get(users.installationid2, users.resourceid2, {}, nexts),
      }, next)

    }

  ], (err, results) => {
    if(err) t.error(err)

    t.equal(results.canaccess.statusCode, 200, '200 can access')
    t.equal(results.cantaccess.statusCode, 403, '403 cant access')

    t.end()
  })

  
})

tape('resourceflat - cross installation get resource with hacked installation id', (t) => {

  const userData1 = authQueries.UserData('bob1')
  const userData2 = authQueries.UserData('bob2')

  let users = null

  async.waterfall([

    (next) => {
      async.series({
        user1: (unext) => createSingleResource(userData1, NODE, unext),
        user2: (unext) => createSingleResource(userData2, NODE, unext)
      }, next)
    },

    (results, next) => {
      const installationid1 = results.user1.user.meta.activeInstallation
      const installationid2 = results.user2.user.meta.activeInstallation
      const resourceid1 = results.user1.resource.id
      const resourceid2 = results.user2.resource.id

      users = {
        installationid1,
        installationid2,
        resourceid1,
        resourceid2
      }

      authQueries.logout(err => {
        if(err) return next(err)
        authQueries.login(userData1, next)
      })
    },

    (login, next) => {

      async.series({
        canaccess: (nexts) => queries.get(users.installationid1, users.resourceid1, {}, nexts),
        cantaccess: (nexts) => queries.get(users.installationid1, users.resourceid2, {}, nexts),
      }, next)

    }

  ], (err, results) => {
    if(err) t.error(err)

    t.equal(results.canaccess.statusCode, 200, '200 can access')
    t.equal(results.cantaccess.statusCode, 403, '403 cant access')

    t.end()
  })

  
})

tape('resourceflat - search resource on type', (t) => {

  const userData = authQueries.UserData()

  authQueries.register(userData, (err, user) => {

    const i = user.body.meta.activeInstallation
    async.series({
      create: (next) => async.series(TYPENODES.map(node => cnext => queries.create(i, node, cnext)), next),
      list: (next) => queries.search(i, {type:'folder'}, next)
    }, (err, results) => {
      if(err) t.error(err)

      t.equal(results.list.body.length, 1, 'only 1 result (folder)')
      t.end()
    })
  })
  
})
/*

tape('resourceflat - order resources', (t) => {

  const userData = authQueries.UserData()
  let base = null

  const getFactory = (index) => (next) => {
    const data = JSON.parse(JSON.stringify(NODE))

    data.meta.order = index
    data.name = 'ITEM' + index

    queries.create(base.i, data, (err, results) => {
      if(err) return done(err)
      next(null, results)
    })
  }

  async.waterfall([
    (next) => authQueries.register(userData, next),

    (b, next) => {
      const user = b.body
      base = {
        user,
        i: user.meta.activeInstallation
      }
      async.series({
        node3: getFactory(3),
        node2: getFactory(2),
        node1: getFactory(1)
      }, next)
    },

    (items, next) => {
      base.items = items
      queries.children(base.i, null, {}, next)
    },

    (results, next) => {

      base.titles = results.body.map(item => item.name)
      base.results = results
      const item1id = base.items.node1.body.id
      const item3id = base.items.node3.body.id

      queries.swap(base.i, item3id, item1id, 'before', next)
    },

    (noop, next) => {
      queries.children(base.i, null, {}, next)
    },

    (results, next) => {
      base.titles2 = results.body.map(item => item.name)
      base.results2 = results
      const item2id = base.items.node2.body.id
      const item3id = base.items.node3.body.id

      queries.swap(base.i, item2id, item3id, 'after', next)
    },

    (noop, next) => {
      queries.children(base.i, null, {}, next)
    },

    (results, next) => {
      base.titles3 = results.body.map(item => item.name)
      next()
    }
  ], (err) => {
    if(err) t.error(err)
    t.deepEqual(base.titles, ['ITEM1', 'ITEM2', 'ITEM3'], 'the 1st order is correct')
    t.deepEqual(base.titles2, ['ITEM3', 'ITEM1', 'ITEM2'], 'the 2nd order is correct')
    t.deepEqual(base.titles3, ['ITEM3', 'ITEM2', 'ITEM1'], 'the 3rd order is correct')

    t.end()
  })


})

*/