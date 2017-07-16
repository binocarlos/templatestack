import ValueLoaderSaga from 'template-ui/lib/plugins/saga/valueLoader'

import api from '../api'
import * as actions from '../actions'

const config = ValueLoaderSaga({
  name: 'config',
  actions: actions.api.config.load,
  api: api.config.load
})

const loaders = {
  config
}

export default loaders