import update from 'immutability-helper'
import { ReducerFactory } from '../../utils/reducer'
import { ID, TYPES } from './actions'

const INITIAL_STATE = {}

const HANDLERS = {
  request: (state, action, id) => {
    return update(state, {
      [id]: {
        $set: {
          status: 'loading',
          error: null,
          request_payload: action.keepPayload ? action.payload : null,
          response_payload: null
        }
      }
    })
  },
  response: (state, action, id) => {
    return update(state, {
      [id]: {
        $merge: {
          status: 'loaded',
          response_payload: action.keepPayload ? action.payload : null,
        }
      }
    })
  },
  error: (state, action, id) => {
    return update(state, {
      [id]: {
        $merge: {
          status: 'error',
          error: action.payload
        }
      }
    })
  },
}

const ApiReducer = ReducerFactory({
  id: ID,
  handlers: HANDLERS,
  types: TYPES,
  initialState: INITIAL_STATE
})

export default ApiReducer