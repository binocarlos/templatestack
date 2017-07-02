export const valuesSelector = (state) => state.value || {}
export const valueSelector = (state, name) => valuesSelector(state)[name]

export const valueSelectors = {
  config: (state) => valueSelector(state, 'config'),
  menuOpen: (state) => valueSelector(state, 'menuOpen'),
  user: (state) => valueSelector(state, 'user')
}