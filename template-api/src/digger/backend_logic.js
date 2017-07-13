'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const async = require('async')
const options = require('../utils/options')
const databaseTools = require('../database/tools')
const tools = require('./tools')

const REQUIRED = []
const DEFAULTS = {}

const STORAGE_REQUIRED = [
  'loadLinks',
  'getResource',
  'search',
  'children',
  'descendents',
  'insertResource',
  'saveResource',
  'createLinks',
  'del',
  'transaction'
]

const BackendLogic = (storage, opts = {}) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  options.processor(storage, {
    required: STORAGE_REQUIRED
  })

  const loadLinks = storage.loadLinks
  const getResource = storage.getResource
  const search = storage.search
  const children = storage.children
  const descendents = storage.descendents
  const insertResource = storage.insertResource
  const saveResource = storage.saveResource
  const createLinks = storage.createLinks
  const transaction = storage.transaction

  const linkTreeLayer = (installationid, parents, done) => {
    const ids = parents.map(p => p.id)
    storage.loadLinks({ ids, installationid }, (err, linkResources) => {
      if(err) return done(err)
      if(linkResources.length<=0) {
        return done(null, parents)
      }
      tools.assignLinksToResources(parents, linkResources)
      linkTreeLayer(installationid, linkResources, (err) => {
        if(err) return done(err)
        done(null, parents)
      })
    })
  }

  // load and inject links for some already loaded resources
  const injectLinks = (query, done) => {
    const resources = query.resources
    linkTree({
      installationid: query.installationid,
      ids: resources.map(resource => resource.id)
    }, (err, links) => {
      if(err) return done(err)
      tools.assignLinksToResources(resources, links)
      done(null, resources)
    })
  }


  // * installationid
  // * ids[]
  const linkTree = (query, done) => {
    storage.loadLinks(query, (err, links) => {
      if(err) return done(err)
      if(links.length <= 0) return done(null, [])
      linkTreeLayer(query.installationid, links, done)
    })
  }


  // * installationid
  // * ids[]
  const linkChildren = (query, done) => {
    storage.loadLinks(query, (err, links) => {
      if(err) return done(err)
      done(null, links.map(mapLink))
    })
  }


  // turn the descendent list into a tree structure where each node has a 'children' property
  //
  // * installationid
  // * id
  // * type
  // * search
  const tree = (query, done) => {
    descendents(query, (err, results) => {
      if(err) return done(err)
      const rootItems = tools.createResourceTree(results)
      done(null, rootItems)
    })
  }


  //  * installationid
  //  * parent
  //  * data
  //     * name
  //     * type
  //     * labels[][]
  //     * meta
  //     * children[resource]
  const createResource = (trx, query, done) => {
    const installationid = query.installationid
    const parent = query.parent
    const data = query.data

    const resource = tools.prepareResource(
      tools.assignChildToParent(parent, data),
      installationid
    )

    const insertResourceData = tools.stripResource(
      resource.data,
      tools.STRIP_CREATE_FIELDS
    )

    async.waterfall([

      // insert the resource
      (next) => insertResource(trx, insertResourceData, next),

      // insert the links
      (insertedResource, next) => {
        const linkData = tools.getLinkData(parent.id, resource.links)

        createLinks(trx, linkData, (err, links) => {
          if(err) return next(err)
          insertedResource.links = links
          next(null, insertedResource)
        })
      },
      
      // create the children in parallel
      // map the results on the .children property of the created resource
      (insertedResource, next) => {

        const childCreators = (resource.children || []).map(child => nextChild => {
          createResource(trx, {
            installationid: installationid,
            parent: insertedResource,
            data: child
          }, nextChild)
        })

        async.parallel(childCreators, (err, children) => {
          if(err) return next(err)
          insertedResource.children = children
          next(null, insertedResource)
        })
      }
    ], done)
  }

  //   * parentid
  //   * installationid
  //   * data
  //     * name
  //     * type
  //     * labels[][]
  //     * meta
  //     * children[resource]
  const create = (trx, query, done) => {

    const installationid = query.installationid
    const parentid = query.parentid
    const data = query.data

    //databaseTools.knexTransaction(knex, (trx, finish) => {

    async.waterfall([

      // first get the parent (if any) so we can assign the first level
      (next) => {
        if(!parentid) return next(null, tools.getRootParent(installationid))
        getResource(parentid, next)
      },

      (parent, next) => {
        createResource(trx, {
          parent,
          installationid: installationid,
          data: data
        }, next)
      }
    ], done)

    //}, done)

  }

  //   * id
  //   * installationid
  //   * data
  //     * name
  //     * type
  //     * labels[][]
  //     * meta
  //     * children[resource]
  const save = (trx, query, done) => {

    const id = query.id
    const installationid = query.installationid
    const data = query.data

    const resource = tools.prepareResource(data, installationid)

    const linkData = tools.getLinkData(id, resource.links || [])

    const updateData = tools.stripResource(data)

    async.series({

      // delete links
      deleteLinks: (next) => deleteLinks(trx, id, next),
        
      // re-insert links
      createLinks: (next) => createLinks(trx, tools.getLinkData(id, resource.links || []), next),

      // save resource
      saveResource: (next) => saveResource(trx, id, updateData, next)

    }, (err, results) => {
      if(err) return done(err)
      done(null, results.saveResource)
    })
  }

  //   * id
  //   * installationid
  const del = (trx, query, done) => {
    knex(tables.resource)
      .where({
        id: query.id,
        installationid: query.installationid
      })
      .del()
      .asCallback(tools.singleExtractor(done))
  }
  

  // keep resource intact so links are not deleted
  const moveChildren = (trx, parent, item, done) => {

    const resource = tools.assignChildToParent(parent, item)
    const updateData = tools.locationResourceUpdate(resource)

    async.waterfall([
      (next) => saveResource(trx, item.id, updateData, next),
      (childResult, next) => {
        const childUpdaters = (resource.children || []).map(child => nextChild => {
          moveChildren(trx, childResult, child, nextChild)
        })
        async.parallel(childUpdaters, (err, results) => {
          if(err) return next(err)
          const result = Object.assign({}, childResult, {
            children: results.children
          })
          next(null, result)
        })
      }
    ], done)
  }

  //   * parentid
  //   * installationid
  //   * data
  const move = (trx, query, done) => {

    const installationid = query.installationid
    const parentid = query.parentid

    const data = query.data

    async.waterfall([

      // first get the parent (if any) so we can assign the first level
      (next) => {
        if(!parentid) return next(null, tools.getRootParent(installationid))
        getResource(parentid, next)
      },

      (parent, next) => {
        moveChildren(trx, parent, data, next)
      }
    ], done)
  }

  //  * installationid
  //  * source
  //  * target
  //  * mode
  const swap = (trx, query, done) => {

    const installationid = query.installationid
    const source = query.source
    const target = query.target
    const mode = query.mode

    let base = {}
    async.waterfall([

      // load the source so we know the parent
      (next) => getResource(source, next),
        
      (sourceResource, next) => {
        base.source = sourceResource
        base.parent = sourceResource.parent

        children({
          id: base.parent,
          installationid
        }, next)
      },

      (children, next) => {

        const preTitles = children.map(c => c.name)
        const preIds = children.map(c => c.id)
        const sourceItem = children.filter(c => c.id == source)[0]
        const targetItem = children.filter(c => c.id == target)[0]

        const orderedItems = children
          .reduce((all, child) => {
            if(child.id == source) return all
            return child.id == target ?
              all.concat(( mode == 'before' ?
                [sourceItem, child] :
                [child, sourceItem] )) :
              all.concat([child])
          }, [])

        const postTitles = orderedItems.map(c => c.name)

        const updateFns = orderedItems
          .map((item, index) => nextItem => {
            item.meta = item.meta || {}
            item.meta.order = index

            save(trx, {
              installationid,
              id: item.id,
              data: {
                meta: item.meta
              }
            }, nextItem)
          })

        async.parallel(updateFns, next)
      }

    ], done)
    
  }

  // load the sub-tree of each thing being pasted
  // strip sub-tree of path
  // add sub-tree to target
  // if cut delete existing sub-tree
  //
  //  * installationid
  //  * parentid
  //  * ids
  //  * mode {cut,copy}

  const paste = (trx, query, done) => {

    const ids = query.ids || []
    const parentid = query.parentid
    const installationid = query.installationid
    const mode = query.mode

    const allResults = {}

    if(ids.length <= 0) return done('no ids passed')

    async.series([

      // load the tree for each resource id being pasted
      (next) => {
        async.parallel(ids.map(id => nextresource => {
          async.waterfall([
            (nextpart) => getResource(id, next),
            (resource, nextpart) => {

              tree({
                installationid,
                id
              }, (err, treeResult) => {
                if(err) return nextpart(err)
                nextpart(null, {
                  item: resource,
                  tree: treeResult
                })
              })

            }
          ], (err, results) => {
            if(err) return nextresource(err)
            if(!results.item) return nextresource('no item found')
            const item = results.item
            item.children = results.tree || []
            nextresource(null, item)
          })
        }), (err, results) => {
          if(err) return next(err)
          allResults.originalItems = results
          allResults.sourceItems = results.map(item => tools.stripTreeFields(item, mode == 'copy' ? true : false))
          next()
        })
      },

      (next) => {
        if(mode == 'copy') {
          async.parallel(allResults.sourceItems.map(item => nextresource => {

            create(trx, {
              installationid,
              parentid,
              data: item
            }, nextresource)
            
          }), (err, results) => {
            if(err) return next(err)
            allResults.targetItems = results
            next()
          })
        }
        else if(mode == 'cut') {
          async.parallel(allResults.sourceItems.map(item => nextresource => {

            move(trx, {
              installationid,
              parentid,
              data: item
            }, nextresource)
            
          }), (err, results) => {
            if(err) return next(err)
            allResults.moveItems = results
            next()
          })
        }
      }

    ], err => {
      if(err) return done(err)
      done(null, allResults)
    })
    
  }


  return {
    loadLinks,
    injectLinks,
    linkTreeLayer,
    linkTree,
    linkChildren,
    getResource,
    search,
    children,
    descendents,
    tree,
    create,
    save,
    del,
    move,
    swap,
    paste,
    transaction
  }
}

module.exports = BackendLogic