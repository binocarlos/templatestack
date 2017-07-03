import ValueReducer from 'template-ui/lib/plugins/value/reducer'
import ApiStatusReducer from 'template-ui/lib/plugins/api/statusReducer'
import * as actions from '../actions'
import config from '../config'

const valueReducer = ValueReducer({
  initialState: config.initialState
})

const apiReducer = ApiStatusReducer({

})

const rootReducers = {
  value: valueReducer,
  api: apiReducer
}

export default rootReducers
