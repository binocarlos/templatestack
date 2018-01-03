import value from '../value/selectors'
import Crud from '../crud/selectors'

const DiggerSelectors = (opts = {}) => {
  const {
    name
  } = opts

  const crudSelectors = Crud({
    name: opts.name
  })

  return {
    list: crudSelectors.list,
    tree: {
      data: (state) => value.get(state, `${name}Descendents`) || [],
    }
  }
}

export default DiggerSelectors