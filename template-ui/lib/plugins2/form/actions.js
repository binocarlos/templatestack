import {
  initialize,
  touch,
  change
} from 'redux-form'

import utils from './utils'

const formActions = {
  initialize,
  change,
  clear: (name) => formActions.initialize(name, {}),
  touchAll: (name, schema = {}) => {
    const fieldNames = utils.fieldNames(schema)
    return touch.apply(null, [name].concat(fieldNames))
  }
}

export default formActions