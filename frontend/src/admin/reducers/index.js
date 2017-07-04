import ValueReducer from 'template-ui/lib/plugins/value/reducer'
import ApiStatusReducer from 'template-ui/lib/plugins/api/reducer'
import * as actions from '../actions'
import config from '../config'

const valueReducer = ValueReducer({
  initialState: config.initialState
})

const apiReducer = ApiStatusReducer({

})

const reducers = {
  value: valueReducer,
  api: apiReducer
}

export default reducers
