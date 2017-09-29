import update from 'immutability-helper'
import ReducerFactory from '../../utils/reducer'
import { TYPES } from './actions'

const INITIAL_STATE = {}

const HANDLERS = {
  [TYPES.set]: (state, action) => {
    return update(state, {
      [action.name]: {
        $set: action.value
      }
    })
  },
  [TYPES.toggle]: (state, action) => {
    return update(state, {
      [action.name]: {
        $set: !(state[action.name] || false)
      }
    })
  }
}

const ValueReducer = (initialState = INITIAL_STATE) => {
  return (state = initialState, action = {}) => {
    const handler = HANDLERS[action.type]
    return handler ?
      handler(state, action) :
      state
  }
}

export default ValueReducer