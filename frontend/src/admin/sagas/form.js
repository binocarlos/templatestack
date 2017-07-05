import FormSaga from 'template-ui/lib/plugins/api/saga'
import forms from '../forms'
import * as actions from './actions'

const getSchema = (name, model) => {
  const form = forms[name]
  if(!form) throw new Error(`no form found: ${name}`)
  return processSchema(form(model))
}

const getActions = (name) => actions.form[name]

const formSaga = FormSaga({
  getSchema,
  getActions
})
export default formSaga