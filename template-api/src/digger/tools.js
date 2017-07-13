// fields we never update using standard crud methods
const STRIP_CREATE_FIELDS = {
  'children': true,
  'links': true
}

const STRIP_SAVE_FIELDS = Object.assign({}, STRIP_CREATE_FIELDS, {
  'installation': true
})

const mapLink = (link) => {
  return {
    id: link.id,
    meta: link.link_meta,
    resource: link
  }
}

const stripResource = (data, fields) => {
  fields = fields || STRIP_SAVE_FIELDS
  return Object.keys(data || {})
    .filter(k => fields[k] ? false : true)
    .reduce((all, k) => {
      all[k] = data[k]
      return all
    }, {})
}

const locationResourceUpdate = (resource) => {
  return {
    parent: resource.parent,
    path: resource.path
  }
}


const getLinkData = (parentid, links) => {
  links = links || []
  links.map(link => {
    return {
      parent: parentid,
      child: link.id,
      meta: link.meta || {},
      type: 'resource'
    }
  })
}

const prepareData = (resource, installation) => {
  const meta = resource.meta || {}
  return Object.assign({}, resource, {
    installation,
    meta: typeof(meta) == 'string' ?
      meta :
      JSON.stringify(meta)
  })
}

const prepareResource = (resource, installation) => {
  const obj = Object.assign({}, resource)
  const children = obj.children || []
  const links = obj.links || []
  delete(obj.children)
  delete(obj.links)
  return {
    data: prepareData(obj, installation),
    children,
    links
  }
}

const assignChildToParent = (parent, child) => {
  let inject = {}
    
  if(parent.id) {
    inject.parent = parent.id
    inject.path = [
      parent.path,
      parent.id
    ].join('.')
  }
  else {
    inject.path = parent.path
  }

  return Object.assign({}, child, inject)
}

const stripTreeFields = (item, removeId) => {
  let ret = Object.assign({}, item)
  delete(ret.parent)
  delete(ret.path)
  delete(ret.installation)
  if(removeId) {
    delete(ret.id)
  }
  ret.children = (ret.children || []).map(item => stripTreeFields(item, removeId))
  return ret
}

const getRootParent = (installation) => {
  return {
    installation,
    path: 'root'
  }
}

const getObjectMap = (arr) => {
  return arr.reduce((all, item) => {
    all[item.id] = item
    return all
  }, {})
}

const assignLinksToResources = (parents, links) => {
  const parentMap = getObjectMap(parents)
  links.forEach(link => {
    const parent = parentMap[link.link_parent]
    if(parent) {
      parent.links = parent.links || []
      parent.links.push(mapLink(link))  
    }
  })
}

const createResourceTree = (resources) => {
  let rootItems = []
  const idMap = resources.reduce((all, item) => Object.assign({}, all, {[item.id]:item}), {})

  resources.forEach(item => {
    const parent = idMap[item.parent]
    if(parent) {
      parent.children = parent.children || []
      parent.children.push(item)
    }
    else {
      rootItems.push(item)
    }
  })
  return rootItems
}

module.exports = {
  STRIP_CREATE_FIELDS,
  STRIP_SAVE_FIELDS,
  mapLink,
  stripResource,
  locationResourceUpdate,
  prepareData,
  getLinkData,
  prepareResource,
  assignChildToParent,
  stripTreeFields,
  getRootParent,
  getObjectMap,
  assignLinksToResources,
  createResourceTree
}