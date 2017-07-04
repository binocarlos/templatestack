import update from 'immutability-helper'

const ensureArgs = (opts = {}) => {
  const { id, handlers, types, initialState } = opts
  if(!id) throw new Error('id required for ReducerFactory')
  if(!handlers) throw new Error('handlers required for ReducerFactory')
  if(!types) throw new Error('types required for ReducerFactory')
  if(!initialState) throw new Error('initialState required for ReducerFactory')
  return opts
}

export const ReducerFactory = (opts = {}) => {
  const { id, handlers, types, initialState, autoUpdate } = ensureArgs(opts)
  const HANDLERS = Object.keys(handlers || {}).reduce((all, handlerName) => {
    const handler = handlers[handlerName]
    const actionType = types[handlerName]
    all[actionType] = handler
    return all
  }, {})
  return (state = initialState, action = {}) => {
    const actionType = action[`type_${id}`]
    const actionName = action[`name_${id}`]
    const handler = HANDLERS[actionType]
    return handler ?
      handler(state, action, actionName) :
      state
  }
}

export default ReducerFactory