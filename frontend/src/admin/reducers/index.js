import { reducer as form } from 'redux-form'
import ValueReducer from 'template-ui/lib/plugins/value/reducer'
import ApiReducer from 'template-ui/lib/plugins/api/reducer'
import * as actions from '../actions'
import config from '../config'

const value = ValueReducer(undefined, config.initialState.value)
const api = ApiReducer()

const reducers = {
  value,
  api,
  form
}

export default reducers
