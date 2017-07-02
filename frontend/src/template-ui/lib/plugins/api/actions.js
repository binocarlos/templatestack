export const TYPES = {
  request: 'API_REQUEST',
  response: 'API_RESPONSE',
  error: 'API_ERROR'
}

const actionFactory = (type, meta) => (payload) => ({
  type,
  name: meta.name,
  payload,
  meta
})

const ApiActions = (meta = {}) => {
  if(!meta.name) throw new Error('name required for api actions')
  return {
    request: actionFactory(TYPES.request, meta),
    response: actionFactory(TYPES.response, meta),
    error: actionFactory(TYPES.error, meta)
  }  
}

export default ApiActions