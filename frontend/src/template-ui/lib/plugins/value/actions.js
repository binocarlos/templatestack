export const TYPES = {
  set: 'VALUE_SET',
  toggle: 'VALUE_TOGGLE'
}

const actionType = (type, name) => `${type}_${name.toUpperCase()}`
const actionFactory = (type, name) => (payload) => ({
  type: actionType(type, name),
  value_type: type,
  name,
  payload
})

const ValueActions = (name) => {
  return {
    set: actionFactory(TYPES.set, name),
    toggle: actionFactory(TYPES.toggle, name)
  }  
}

export default ValueActions