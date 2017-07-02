import { createAction } from 'redux-act'

// used to keep track of any api request
// the name and status are passed
export const genericActions = {
  status: createAction(`api status`, (name, status, data) => {name,status,data})
}

const ApiActions = (opts = {}) => {
  if(!opts.name) throw new Error('name required for api actions')
  const NAME = opts.name
  return {
    request: createAction(`api request: ${NAME}`),
    ok: createAction(`api ok: ${NAME}`),
    error: createAction(`api error: ${NAME}`),
    reset: createAction(`api reset: ${NAME}`)
  }  
}

export default ApiActions