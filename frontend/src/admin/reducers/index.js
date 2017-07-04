import ValueReducer from 'template-ui/lib/plugins/value/reducer'
import ApiReducer from 'template-ui/lib/plugins/api/reducer'
import FormReducer from 'template-ui/lib/plugins/form/reducer'
import * as actions from '../actions'
import config from '../config'

const value = ValueReducer(undefined, config.initialState.value)
const api = ApiStatusReducer()
const form = FormReducer()

const reducers = {
  value,
  api,
  form
}

export default reducers
