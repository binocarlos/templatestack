export const TYPES = {
  set: 'VALUE_SET',
  toggle: 'VALUE_TOGGLE'
}

const ValueActions = {
  _types: TYPES,
  set: (name, value) => ({
    type: TYPES.set,
    name,
    value
  }),
  toggle: (name) => ({
    type: TYPES.toggle,
    name
  })
}

export default ValueActions