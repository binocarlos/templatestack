import update from 'immutability-helper'
import { TYPES } from './actions'

const INITIAL_STATE = {}

const ApiStatusReducer = (opts = {}) => (state = opts.initialState || INITIAL_STATE, action) => {
  switch (action.api_type) {

    case TYPES.request:
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
