import update from 'immutability-helper'
import { createReducer } from 'redux-act'
import { genericActions } from './actions'

const ApiStatusReducer = (opts = {}) => {
  const defaultState = opts.defaultState || {}
  return createReducer({
    [genericActions.status]: (state, payload) => {
      return update(state, {
        [payload.name]: {
          $set: payload
        }
      })
    }
  }, defaultState)
}

export default ApiStatusReducer