import { ActionFactory, TypeFactory } from '../../utils/action'

export const ID = 'api'
const ACTIONS = {
  request: null,
  response: null,
  error: null
}

export const TYPES = TypeFactory(ID, ACTIONS)
const ApiActions = ActionFactory(ID, ACTIONS)

export default ApiActions