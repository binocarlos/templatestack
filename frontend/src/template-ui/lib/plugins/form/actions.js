export const TYPES = {
  initialize: 'FORM_INITIALIZE',
  setValue: 'FORM_SET_VALUE',
  setMeta: 'FORM_SET_META'
}

const actionType = (type, name) => `${type}_${name.toUpperCase()}`
const actionFactory = (type, name, action) => {
  return Object.assign({}, action, {
    type: actionType(type, name),
    value_type: type,
  })
})

const FormActions = (opts = {}) => {
  const { name } = opts
  if(!name) throw new Error('FormActions needs a name option')
  return {
    initialize: (data) => actionFactory(TYPES.initialize, name, { data })
      return actionFactory(TYPES.initialize, name, { data })
        data
      })
      actionFactory(TYPES.set, name)
    },
    toggle: actionFactory(TYPES.toggle, name)
  }  
}

export default ValueActions