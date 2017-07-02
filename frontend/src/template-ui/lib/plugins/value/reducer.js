import update from 'immutability-helper'
import { createReducer } from 'redux-act'

const ValueReducer = (opts = {}) => {
  if(!opts.actions) throw new Error('actions required')
  const actions = opts.actions
  const defaultState = opts.defaultState || {}
  return createReducer({

    [actions.set]: (state, payload) => {
      return update(state, {
        [payload.name]: {
          $set: payload.value
        }
      })
    },

    [actions.toggle]: (state, payload) => {
      const existing = state[payload.name] || false
      return update(state, {
        [payload.name]: {
          $set: !existing
        }
      })
    }

  }, defaultState)
}

export default ValueReducer