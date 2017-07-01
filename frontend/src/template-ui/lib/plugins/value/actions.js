import { createAction } from 'redux-act'

const ValueActions = (opts = {}) => {
  const NAME = opts.name || 'value actions'
  return {
    setValue: createAction(`${NAME}: set value`, (name, value) => ({name,value}))
  }
}

export default ValueActions