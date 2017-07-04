import update from 'immutability-helper'
import { ReducerFactory } from '../../utils/reducer'
import { TYPES } from './actions'

const ID = 'api'
const INITIAL_STATE = {}

const HANDLERS = {
  request: (state, action) => {
    let requestStatus = {
      phase: 'loading',
      error: null
    }
    if(action.keepPayload) {
      requestStatus.payload_request = action.payload
    }
    return update(state, {
      [action.name]: {
        $set: requestStatus
      }
    })
  },
  response: (state, action) => {
    let responseStatus = {
      phase: 'loaded'
    }
    if(action.keepPayload) {
      responseStatus.payload_response = action.payload
    }
    return update(state, {
      [action.name]: {
        $set: responseStatus
      }
    })
  },
  error: (state, action) => {
    return update(state, {
      [action.name]: {
        $set: {
          phase: 'error',
          error: action.payload
        }
      }
    })
  }
}

const ApiStatusReducer = ReducerFactory({
  id: ID,
  initialState: INITIAL_STATE
})

const ApiStatusReducer = (opts = {}) => (state = opts.initialState || INITIAL_STATE, action) => {
  switch (action.api_type) {

    case TYPES.request:
      

    case TYPES.response:
      let responseStatus = {
        phase: 'loaded'
      }
      if(action.keepPayload) {
        responseStatus.payload_response = action.payload
      }
      return update(state, {
        [action.name]: {
          $set: responseStatus
        }
      })

    case TYPES.error:
      return update(state, {
        [action.name]: {
          $set: {
            phase: 'error',
            error: action.payload
          }
        }
      })

    default:
      return state
  }
}

export default ApiStatusReducer
