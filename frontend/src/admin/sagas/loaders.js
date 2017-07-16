import ValueLoaderSaga from 'template-ui/lib/plugins/saga/valueLoader'

import api from '../api'
import * as actions from '../actions'

const loadConfig = ValueLoaderSaga({
  name: 'config',
  actions: actions.api.config.load,
  api: api.config.load
})

const triggers = {
  loadConfig
}

export default triggers