import value from 'template-ui/lib/plugins2/value/selectors'

const CrudSelectors = (opts = {}) => {
  const {
    name
  } = opts

  const list = {
    data: (state) => value.get(state, `${name}List`) || [],
    selected: (state) => value.get(state, `${name}ListSelected`) || [],
    selectedItems: (state) => {
      const selectedIndexes = list.selected(state)
      const data = list.data(state)
      return data.filter((item, i) => selectedIndexes.indexOf(i) >= 0)
    },
    deleteWindow: (state) => value.get(state, `${name}ListDeleteWindowOpen`) ? true : false,
    searchWindow: (state) => value.get(state, `${name}ListSearchWindowOpen`) ? true : false
  }

  return {
    list
  }
}

export default CrudSelectors