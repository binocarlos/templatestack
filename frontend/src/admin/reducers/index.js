import ValueReducer from 'template-ui/lib/plugins/value/reducer'
import ApiStatusReducer from 'template-ui/lib/plugins/api/statusReducer'
import * as actions from '../actions'
import config from '../config'

const valueReducer = ValueReducer({
  actions: actions.value,
  defaultState: config.defaultValues
})

const apiReducer = ApiStatusReducer({

})

const rootReducers = {
  value: valueReducer,
  api: apiReducer
}

export default rootReducers
