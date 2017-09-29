import {
  initialize,
  touch,
  change
} from 'redux-form'

const formActions = {
  initialize,
  change,
  clear: (name) => formActions.initialize(name, {}),
  touchAll: (name, fields = {}) => {
    return touch.apply(null, [name].concat(Object.keys(fields)))
  }
}

export default formActions