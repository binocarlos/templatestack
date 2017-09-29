import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import options from 'template-tools/src/utils/options'

import valueActions from '../value/actions'

import actions from './actions'
import selectors from './selectors'

import formUtils from './utils'

const REQUIRED = [
  
]

const DEFAULTS = {
  
}

const FormSagas = (opts = {}) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })


  function* listWindowAdd(payload) {
    const { id, item, schema } = payload
    const defaults = formUtils.getDefaults(schema)
    yield put(actions.initialize(id, defaults))
    yield put(valueActions.set(`${id}_editId`, null))
    yield put(valueActions.set(`${id}_editWindow`, true))
  }


  function* listWindowEdit(payload) {
    const { id, item } = payload
    yield put(actions.initialize(id, item))
    yield put(valueActions.set(`${id}_editId`, item.id))
    yield put(valueActions.set(`${id}_editWindow`, true))
  }

  function* listCloseWindow(payload) {
    const { id } = payload
    yield put(valueActions.set(`${id}_editId`, null))
    yield put(valueActions.set(`${id}_editWindow`, false))
  }

  function* listConfirmWindow(payload) {
    const { id } = payload
    const values = yield select(state => selectors.values(state, id))
    console.log('-------------------------------------------');
    console.log('-------------------------------------------');
    console.dir(values)
  }

  return {
    listWindowAdd,
    listWindowEdit,
    listCloseWindow,
    listConfirmWindow
  }
 
}

export default FormSagas