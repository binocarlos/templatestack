import {
  initialize
} from 'redux-form'

const FormActions = (forms) => {
  const formActions = {
    initialize,
    clear: (name) => formActions.initialize(name, {}),
    reset: (name) => {
      const formDesc = forms[name]
      if(!formDesc) throw new Error(`form not found ${name}`)
      return formActions.initialize(name, formDesc.initialValues || {})
    }
  }
  return formActions
}

export default FormActions