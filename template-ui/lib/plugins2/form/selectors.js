import {
  getFormValues,
  isValid,
  getFormMeta,
  getFormSyncErrors
} from 'redux-form'

const FormSelectors = {
  values: (state, name) => getFormValues(name)(state),
  valid: (state, name) => isValid(name)(state),
  meta: (state, name) => getFormMeta(name)(state),
  errors: (state, name) => getFormSyncErrors(name)(state)
}

export default FormSelectors