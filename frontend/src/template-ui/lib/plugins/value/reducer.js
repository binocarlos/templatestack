import update from 'immutability-helper'
import { ReducerFactory } from '../../utils/reducer'
import { ID, TYPES } from './actions'

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

const ValueReducer = ReducerFactory({
  id: ID,
  handlers: HANDLERS,
  types: TYPES,
  initialState: INITIAL_STATE
})

export default ValueReducer