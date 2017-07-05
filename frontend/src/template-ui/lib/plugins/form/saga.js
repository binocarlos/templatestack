import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import { ID } from './actions'
import { actionInfo } from '../../utils/actions'
import { PatternHandlers } from '../../utils/saga'
import { 
  processSchema,
  getModelData,
  getFormData,
  getMetaData
} from './utils'

const FormSaga = (opts = {}) => {
  if(!opts.getSchema) throw new Error('getSchema needed for FormSaga')
  if(!opts.getActions) throw new Error('getActions needed for FormSaga')

  const id = opts.id || ID
  const forms = opts.forms

  // get the schema for the 'login' form
  const getSchema = (name, model) => {
    const rawSchema = opts.getSchema(name, model)
    if(!rawSchema) throw new Error(`no schema found: ${name}`)
    return processSchema(rawSchema(model))
  }

  // get the actions for the 'login form'
  const getActions = (name) => {
    const actions = opts.getActions(name)
    if(!actions) throw new Error(`no actions found: ${name}`)
    return actions
  }

  function* initialize(action) {
    const rawmodel = action.model
    const info = actionInfo(action)
    const schema = getSchema(info.name, rawmodel)
    const actions = getActions(info.name)

    const model = getModelData(schema, rawmodel)
    const form = getFormData(schema, model)
    const meta = getMetaData(schema, model)

    yield put(actions.set({
      model,
      form,
      meta
    }))
  }

  function* changed(action) {
    console.log('-------------------------------------------');
    console.log('changed')
    console.dir(action)
  }

  const handlers = PatternHandlers({
    id,
    handlers: {
      initialize,
      changed  
    }
  })

  return handlers
}

export default FormSaga