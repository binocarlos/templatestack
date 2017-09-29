import {
  getFormValues,
  isValid,
  getFormMeta,
  getFormSyncErrors
} from 'redux-form'

import valueSelectors from '../value/selectors'

const FormSelectors = {
  values: (state, name) => getFormValues(name)(state),
  valid: (state, name) => isValid(name)(state),
  meta: (state, name) => getFormMeta(name)(state),
  errors: (state, name) => getFormSyncErrors(name)(state),
  list: {
    selected: (state, id) => valueSelectors.get(state, `${id}_selected`) || [],
    deleteWindow: (state, id) => valueSelectors.get(state, `${id}_deleteWindow`) ? true : false,
    itemWindow: (state, id) => valueSelectors.get(state, `${id}_itemWindow`) ? true : false,
    itemIndex: (state, id) => valueSelectors.get(state, `${id}_itemIndex`),
  }
}

export default FormSelectors