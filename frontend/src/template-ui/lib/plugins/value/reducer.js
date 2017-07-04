import update from 'immutability-helper'
import { ReducerFactory } from '../../utils/reducer'
import { ID, GetTypes } from './actions'

const INITIAL_STATE = {}

const HANDLERS = {
  set: (state, action, id) => {
    return update(state, {
      [id]: {
        $set: action.payload
      }
    })
  },
  toggle: (state, action, id) => {
    return update(state, {
      [id]: {
        $set: !(state[id] || false)
      }
    })
  }
}

const ValueReducer = (id = ID, initialState = INITIAL_STATE) => {
  const types = GetTypes(id)
  return ReducerFactory({
    id,
    types,
    initialState,
    handlers: HANDLERS
  })
}

export default ValueReducer