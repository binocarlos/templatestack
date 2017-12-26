import value from 'template-ui/lib/plugins2/value/actions'

const CrudActions = (opts = {}) => {
  const {
    name
  } = opts
  return {
    list: {
      setData: (data) => value.set(`${name}List`, data),
      setSelected: (data) => value.set(`${name}ListSelected`, data),
      setDeleteWindow: (val) => value.set(`${name}ListDeleteWindowOpen`, val),
      setSearchWindow: (val) => value.set(`${name}ListSearchWindowOpen`, val),
    }
  }
}

export default CrudActions