export const TYPES = {
  request: 'API_REQUEST',
  response: 'API_RESPONSE',
  error: 'API_ERROR'
}

const actionType = (type, name) => `${type}_${name.toUpperCase()}`
const actionFactory = (type, name) => (payload) => ({
  type: actionType(type, name),
  api_type: type,
  name,
  payload
})

const ApiActions = (name) => {
  if(!name) throw new Error('name required for api actions')
  return {
    request: actionFactory(TYPES.request, name),
    response: actionFactory(TYPES.response, name),
    error: actionFactory(TYPES.error, name)
  }  
}

export default ApiActions