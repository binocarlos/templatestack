const Types = (opts = {}) => {
  const { types, icons } = opts
  const digger = {
    types,
    getInitialData: (type) => {
      const schema = digger.getType(type)
      return {
        type,
        name: '',
        meta: {},
        children: []
      }
    },
    getType: (type) => types[type] || types.item,
    getIcon: (item) => {
      if(digger.isRoot(item)) return icons.root
      const schema = digger.getType(item.type)
      return schema.icon
    },
    getForm: (item) => {
      if(digger.isRoot(item)) return []
      if(!item || !item.type) return []
      const schema = digger.getType(item.type)
      return (schema.form || item.form).fields
    },
    getTitle: (item) => {
      const schema = digger.getType(item.type)
      return schema.title || 'item'
    },
    isLeaf: (item) => {
      if(digger.isRoot(item)) return false
      const schema = types[item.type] || types.item
      return schema.leaf ? true : false
    },
    isRoot: (item) => item.type == 'root',
    getChildrenTypes: (item) => {
      if(digger.isRoot(item)) return ['folder', 'item']
      const schema = types[item.type] || types.item
      if(schema.leaf) return []
      return schema.children || []
    },
  }

  return digger
}

export default Types