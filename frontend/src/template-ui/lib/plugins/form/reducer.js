import update from 'immutability-helper'
import ReducerFactory from '../../utils/reducer'
import { ID } from './actions'

const INITIAL_STATE = {}

const newFormState = (model = {}) => ({
  model,
  form: {},
  meta: {}
})

const HANDLERS = {
  initialize: (state, action, id) => {
    return update(state, {
      [id]: {
        $set: newFormState(action.model)
      }
    })
  },  
  write: (state, action, id) => {
    return update(state, {
      [id]: {
        [action.section]: {
          $merge: action.values
        }
      }
    })
  },
  set: (state, action, id) => {
    return update(state, {
      [id]: {
        $set: action.values
      }
    })
  }
}

const FormReducer = (id = ID, initialState = INITIAL_STATE) => {
  return ReducerFactory({
    id,
    initialState,
    handlers: HANDLERS
  })
}

export default FormReducer