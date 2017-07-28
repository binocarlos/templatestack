import {
  getFormValues,
  isValid
} from 'redux-form'

export const formValuesSelector = (name, formDesc) => {
  const selector = getFormValues(name)
  const handler = (state) => {
    const ret = selector(state)
    return ret || formDesc.initialValues || {}
  }
  return handler
}

export const formValidSelector = (name) => isValid(name)

const FormCollectionSelectors = (forms) => {
  return Object.keys(forms).reduce((all, name) => {
    all[name] = {
      valid: formValidSelector(name),
      values: formValuesSelector(name, forms[name])
    }
    return all
  }, {})
}

export default FormCollectionSelectors