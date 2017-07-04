import update from 'immutability-helper'

const ensureArgs = (opts = {}) => {
  const { id, handlers, types, initialState } = opts
  if(!id) throw new Error('id required for ReducerFactory')
  if(!handlers) throw new Error('handlers required for ReducerFactory')
  if(!initialState) throw new Error('initialState required for ReducerFactory')
  return opts
}

export const ReducerFactory = (opts = {}) => {
  const { id, handlers, initialState } = ensureArgs(opts)
  return (state = initialState, action = {}) => {
    if(action._genericid != id) return state
    const handler = handlers[action._genericaction]
    return handler ?
      handler(state, action, action._genericname) :
      state
  }
}

export default ReducerFactory