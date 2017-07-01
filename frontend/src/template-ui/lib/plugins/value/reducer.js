import update from 'immutability-helper'
import { createAction } from 'redux-act'

const ValueReducer = (opts = {}) => {
  if(!opts.actions) throw new Error('actions required')
  const actions = opts.actions
  const defaultState = opts.defaultState || {}
  return createReducer({
    [actions.setValue]: (state, payload) => {
      return update(state, {
        [payload.name]: {
          $set: payload.value
        }
      })
    }
  }, defaultState)
}

export default ConfigActions