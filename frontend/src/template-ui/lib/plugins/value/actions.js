import { createAction } from 'redux-act'

const ValueActions = (opts = {}) => {
  const NAME = opts.name || 'value actions'
  return {
    set: createAction(`${NAME}: set value`, (name, value) => ({name,value})),
    toggle: createAction(`${NAME}: toggle value`, (name) => ({name}))
  }
}

export default ValueActions