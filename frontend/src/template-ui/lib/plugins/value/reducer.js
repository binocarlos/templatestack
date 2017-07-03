import update from 'immutability-helper'
import { TYPES } from './actions'

const INITIAL_STATE = {}

const ValueReducer = (opts = {}) => (state = opts.initialState || INITIAL_STATE, action) => {
  switch (action.value_type) {

    case TYPES.set:
      return update(state, {
        [action.name]: {
          $set: action.payload
        }
      })

    case TYPES.toggle:
      const existing = state[action.name] || false
      return update(state, {
        [action.name]: {
          $set: !existing
        }
      })

    default:
      return state
  }
}

export default ValueReducer
