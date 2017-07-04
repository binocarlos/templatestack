import ValueReducer from 'template-ui/lib/plugins/value/reducer'
import ApiStatusReducer from 'template-ui/lib/plugins/api/reducer'
import * as actions from '../actions'
import config from '../config'

const value = ValueReducer('value', config.initialState.value)
const api = ApiStatusReducer('api')

const reducers = {
  value,
  api
}

export default reducers
