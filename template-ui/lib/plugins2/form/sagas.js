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

import formSelectors from '../form/selectors'

import actions from './actions'
import selectors from './selectors'

import formUtils from './utils'

const REQUIRED = [
  
]

const DEFAULTS = {
  
}

const List = (opts = {}) => {
  function* add(payload) {
    const { id, item, schema } = payload
    const defaults = formUtils.getDefaults(schema)
    yield put(actions.initialize(id, defaults))
    yield put(valueActions.set(`${id}_itemIndex`, null))
    yield put(valueActions.set(`${id}_itemWindow`, true))
  }

  function* edit(payload) {
    const { id, item, index } = payload
    yield put(actions.initialize(id, item))
    yield put(valueActions.set(`${id}_itemIndex`, index))
    yield put(valueActions.set(`${id}_itemWindow`, true))
  }

  function* del(payload) {
    const { id, item, index } = payload
    yield put(valueActions.set(`${id}_deleteWindow`, true))
  }

  function* selected(payload) {
    const { id, selected } = payload
    yield put(valueActions.set(`${id}_selected`, selected))
  }

  function* cancel(payload) {
    const { id } = payload
    yield put(valueActions.set(`${id}_itemIndex`, null))
    yield put(valueActions.set(`${id}_itemWindow`, false))
    yield put(valueActions.set(`${id}_deleteWindow`, false))
  }

  function* confirmItem(payload) {
    const { id, form, field, values } = payload

    const valid = yield select(state => formSelectors.valid(state, id))

    if(!valid) {
      yield put(actions.form.touchAll('project', forms.project))
      return
    }

    console.log('-------------------------------------------');
    console.log('-------------------------------------------');
    console.log('here')
    console.log(form)
    console.dir(values)
    console.dir(id)
    return
    console.dir(payload)
    const index = yield select(state => selectors.list.itemIndex(state, id))
    
    // add mode
    if(typeof(index) !== 'number') {
      yield put(arrayPush(form, field, values))
    }
    // edit mode
    else {
      yield put(arraySplice(form, field, index, 1, values))
    }
  }

  function* confirmDelete(payload) {
    const { form, field, selected } = payload
    const values = yield select(state => selectors.values(state, form))
    const value = (values[field] || []).filter((v, i) => selected.indexOf(i) >= 0 ? false : true)
    yield put(actions.change(form, field, value))
  }

  return {
    add,
    edit,
    del,
    selected,
    cancel,
    confirmItem,
    confirmDelete
  } 
}

const FormSagas = (opts = {}) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const list = List(opts)

  function* listController(payload) {
    const action = list[payload.action]
    if(!action) throw new Error(`form saga list: no action found: ${payload.action}`)
    yield call(action, payload)
  }

  return {
    list: listController
  }
}

export default FormSagas