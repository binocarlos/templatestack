import { ActionFactory, TypeFactory } from '../../utils/actions'

export const ID = 'value'
const ACTIONS = {
  set: null,
  toggle: null
}

export const TYPES = TypeFactory(ID, ACTIONS)
const ValueActions = ActionFactory(ID, ACTIONS)

export default ValueActions