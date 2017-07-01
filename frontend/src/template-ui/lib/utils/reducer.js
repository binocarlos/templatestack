import { createReducer } from 'redux-act'

const ValueReducer = (opts = {}) => {
  if(!opts.actions) throw new Error('actions required')
  const actions = opts.actions
  const DEFAULT_STATE = opts.defaultState || {}
  return createReducer({
    [actions.set]: (state) => state + 1,
    [decrement]: (state) => state - 1,
    [add]: (state, payload) => state + payload,
  }, DEFAULT_STATE)
}

export default ConfigActions