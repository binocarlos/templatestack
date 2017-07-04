import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import { ID } from './actions'
import { actionInfo } from '../../utils/actions'
import { PatternHandlers } from '../../utils/saga'
import { getInitialData } from './utils'

const FormSaga = (opts = {}) => {
  if(!opts.forms) throw new Error('forms needed for FormSaga')

  const id = opts.id || ID
  const forms = opts.forms

  const getSchema = (name, data) => {
    const form = forms[name]
    if(!form) throw new Error(`no form found: ${name}`)
    return form(data)
  }

  function* initialize(action) {
    const model = action.model
    const info = actionInfo(action)

    console.log('-------------------------------------------');
    console.dir(info)

    const schema = getSchema(info.name)

    console.log('-------------------------------------------');
    console.log('schema')
    console.dir(schema)
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