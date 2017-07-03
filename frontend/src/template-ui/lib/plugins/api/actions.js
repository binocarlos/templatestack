import { ActionFactory } from '../../utils/action'

const payloadMap = payload => ({ payload })

const ACTIONS = {
  request: payloadMap,
  response: payloadMap,
  error: payloadMap
}
/*
export const TYPES = {
  request: 'API_REQUEST',
  response: 'API_RESPONSE',
  error: 'API_ERROR'
}

const handler = (type, name, action) => (payload) => {

}
*/
const ApiActions = ActionFactory('api', ACTIONS)


/*
(name) => {
  if(!name) throw new Error('name required for api actions')

  return ActionFactory(name, ACTIONS)

  return {
    request: (payload) => actionFactory(TYPES.request, name, { payload }),
    response: (payload) => actionFactory(TYPES.response, name, { payload }),
    error: (payload) => actionFactory(TYPES.error, name, { payload })
  }  
}
*/

export default ApiActions