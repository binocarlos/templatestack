import ValueReducer from 'template-ui/lib/plugins/value/reducer'
import * as actions from '../actions'

const valueReducer = ValueReducer({
  actions: actions.value
})

const rootReducers = {
  value: valueReducer
}

export default rootReducers
