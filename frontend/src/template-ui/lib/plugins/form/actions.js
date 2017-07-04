import ActionFactory from '../../utils/actions'

export const ID = 'form'

const ACTIONS = {
  initialize: (model = {}) => ({ model }),
  changed: (name, value) => ({ name, value }),
  write: (section, values) => ({ section, values })
}

const FormActions = (id = ID) => ActionFactory(id, ACTIONS)

export default FormActions