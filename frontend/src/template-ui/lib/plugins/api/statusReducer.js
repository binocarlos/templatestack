import update from 'immutability-helper'
import { createReducer } from 'redux-act'
import { TYPES } from './actions'

const ApiStatusReducer = (opts = {}) => {
  const defaultState = opts.defaultState || {}
  return createReducer({

    [TYPES.request]: (state, payload, meta) => {
      let newData = {
        phase: 'loading',
        error: null
      }
      if(meta.keepPayload) {
        newData.question = payload
      }
      return update(state, {
        [meta.name]: {
          $set: newData
        }
      })
    },

    [TYPES.response]: (state, payload, meta) => {
      let newData = {
        phase: 'loaded'
      }
      if(meta.keepPayload) {
        newData.answer = payload
      }
      return update(state, {
        [meta.name]: {
          $set: newData
        }
      })
    },

    [TYPES.error]: (state, payload, meta) => {
      return update(state, {
        [meta.name]: {
          $set: {
            phase: 'error',
            error: payload
          }
        }
      })
    }

  }, defaultState)
}

export default ApiStatusReducer