import value from '../value/actions'
import Crud from '../crud/actions'

const DiggerActions = (opts = {}) => {
  const {
    name
  } = opts

  const crudActions = Crud({
    name: opts.name
  })

  return {
    list: crudActions.list,
    tree: {
      setData: (data) => value.set(`${name}Descendents`, data), 
    }
  }
}

export default DiggerActions