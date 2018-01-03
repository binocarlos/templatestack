import value from '../value/selectors'
import router from '../router/selectors'
import Crud from '../crud/selectors'

const flattenItems = (items) => {
  return items.reduce((all, item) => {
    all = all.concat([item])
    all = all.concat(flattenItems(item.children || []))
    return all
  }, [])
}

const getItem = (items, id) => {
  const flatItems = flattenItems(items)
  return flatItems.filter(item => item.id == id)[0]
}

const DiggerSelectors = (opts = {}) => {
  const {
    name
  } = opts

  const crudSelectors = Crud({
    name: opts.name
  })

  const selectors = {
    list: crudSelectors.list,
    tree: {
      data: (state) => value.get(state, `${name}Descendents`) || [],
      item: (state, id) => {
        const data = selectors.tree.data(state)
        return getItem(data, id)
      },
      selectedItem: (state) => {
        const id = router.param(state, 'viewid')
        const data = selectors.tree.data(state)
        return getItem(data, id)
      }
    }
  }

  return selectors
}

export default DiggerSelectors