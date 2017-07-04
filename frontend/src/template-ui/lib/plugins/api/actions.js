import { ActionFactory, TypeFactory } from '../../utils/actions'

export const ID = 'api'
const ACTIONS = {
  request: null,
  response: null,
  error: null
}

export const GetTypes = (id = ID) => TypeFactory(id, ACTIONS)
const ApiActions = (id = ID) => ActionFactory(id, ACTIONS)

export default ApiActions