import ValueReducer from 'template-ui/lib/plugins/value/reducer'
import ApiReducer from 'template-ui/lib/plugins/api/reducer'
import * as actions from '../actions'

const valueReducer = ValueReducer({
  actions: actions.value
})

const apiReducer = ApiReducer({

})

const rootReducers = {
  value: valueReducer,
  api: apiReducer
}

export default rootReducers
