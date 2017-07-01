import { createAction } from 'redux-act'

const ApiActions = (opts = {}) => {
  const name = opts.name || ''
  const request = createAction(`api request ${name}`)
  const ok = createAction(`api ok ${name}`)
  const error = createAction(`api error ${name}`)
  const reset = createAction(`api reset ${name}`)
  return {
    request,
    ok,
    error,
    reset
  }  
}
