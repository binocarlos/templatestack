import value from 'template-ui/lib/plugins2/value/selectors'

const CrudSelectors = (opts = {}) => {
  const {
    name
  } = opts
  return {
    list: {
      data: (state) => value.get(state, `${name}List`) || [],
      selected: (state) => value.get(state, `${name}Selected`) || [],
      deleteWindow: (state) => value.get(state, `${name}DeleteWindowOpen`) ? true : false  
    }
  }
}

export default CrudSelectors