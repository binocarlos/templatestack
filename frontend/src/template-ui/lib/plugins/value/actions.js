import { ActionFactory, TypeFactory } from '../../utils/actions'

export const ID = 'value'
const ACTIONS = {
  set: null,
  toggle: null
}

export const GetTypes = (id = ID) => TypeFactory(id, ACTIONS)
const ValueActions = (id = ID) => ActionFactory(id, ACTIONS)

export default ValueActions