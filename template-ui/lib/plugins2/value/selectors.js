
const all = (state) => state.value || {}
const get = (state, name) => all(state)[name]

const valueSelectors = {
  all,
  get,
  value: get

}

export default valueSelectors