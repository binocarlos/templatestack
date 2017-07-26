import ActionFactory from '../../utils/actions'

export const ID = 'api'
const ACTIONS = {
  request: null,
  response: null,
  error: null
}

const ApiActions = (id = ID) => ActionFactory(id, ACTIONS)

export default ApiActions