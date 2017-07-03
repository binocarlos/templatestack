import update from 'immutability-helper'
import { TYPES } from './actions'

const INITIAL_STATE = {}

const FormReducer = (opts = {}) => {
  const { getSchema } = opts
  if(!getSchema) throw new Error('FormActions needs a getSchema option')
  return (state = opts.initialState || INITIAL_STATE, action) => {

    switch (action.form_type) {

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

export default FormReducer
