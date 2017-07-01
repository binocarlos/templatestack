export const valuesSelector = (state) => state.values || {}
export const valueSelector = (state, name, def) => valuesSelector(state)[name] || def
export const configSelector = (name) => valueSelector('config', {})