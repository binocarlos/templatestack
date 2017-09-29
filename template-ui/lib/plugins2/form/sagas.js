import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import options from 'template-tools/src/utils/options'

import { 
  arrayPush,
  arraySplice,
  arrayRemove,
  arraySwap
} from 'redux-form'

import valueActions from '../value/actions'
import valueSelectors from '../value/selectors'

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
    yield put(valueActions.set(`${id}_editIndex`, null))
    yield put(valueActions.set(`${id}_editWindow`, true))
  }

  function* listWindowEdit(payload) {
    const { id, item, index } = payload
    yield put(actions.initialize(id, item))
    yield put(valueActions.set(`${id}_editIndex`, index))
    yield put(valueActions.set(`${id}_editWindow`, true))
  }

  function* listCloseWindow(payload) {
    const { id } = payload
    yield put(valueActions.set(`${id}_editIndex`, null))
    yield put(valueActions.set(`${id}_editWindow`, false))
  }

  function* listConfirmWindow(payload) {
    const { id, form, field } = payload
    const values = yield select(state => selectors.values(state, id))
    const index = yield select(state => valueSelectors.get(state, `${id}_editIndex`))

    // add mode
    if(typeof(index) !== 'number') {
      yield put(arrayPush(form, field, values))
    }
    // edit mode
    else {
      yield put(arraySplice(form, field, index, 1, values))
    }
  }

  function* listDelete(payload) {
    const { form, field, selected } = payload
    const values = yield select(state => selectors.values(state, form))
    const value = (values[field] || []).filter((v, i) => selected.indexOf(i) >= 0 ? false : true)
    yield put(actions.change(form, field, value))
  }

  return {
    listWindowAdd,
    listWindowEdit,
    listCloseWindow,
    listConfirmWindow,
    listDelete
  }
 
}

export default FormSagas