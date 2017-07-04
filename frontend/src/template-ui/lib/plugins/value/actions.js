import ActionFactory from '../../utils/actions'

export const ID = 'value'
const ACTIONS = {
  set: null,
  toggle: null
}

const ValueActions = (id = ID) => ActionFactory(id, ACTIONS)

export default ValueActions