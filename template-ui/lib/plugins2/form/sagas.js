import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import options from 'template-tools/src/utils/options'

import { 
  arrayPush,
  arraySplice,
  arrayRemove,
  arraySwap,
  change
} from 'redux-form'

import apiSaga from '../api/saga'

import systemActions from '../system/actions'
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

function* search(req) {

  const section = 'itemSearch'
  const searchString = req.payload
  const api = req.api
  const id = req.id

  yield put(valueActions.set(`${section}_${id}`, searchString))

  if(!searchString) {
    yield put(valueActions.set(`${section}Results_${id}`, null))
    return
  }

  let { answer, error } = yield call(apiSaga, {
    name: `${section}Api_${id}`,
    handler: api,
    payload: {
      search: searchString
    }
  })
  if(error) {
    yield put(systemActions.message(error))
    yield put(valueActions.set(`${section}Results_${id}`, null))
  }
  else {
    yield put(valueActions.set(`${section}Results_${id}`, answer))
  }
  
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
    const { id, form, field, values, schema } = payload

    const valid = yield select(state => formSelectors.valid(state, id))

    if(!valid) {
      yield put(actions.form.touchAll(id, schema))
      return
    }

    const index = yield select(state => selectors.list.itemIndex(state, id))
    
    // add mode
    if(typeof(index) !== 'number') {
      yield put(arrayPush(form, field, values))
    }
    // edit mode
    else {
      yield put(arraySplice(form, field, index, 1, values))
    }

    yield call(selected, {
      id,
      selected: []
    })
    yield call(cancel, {
      id
    })
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
    confirmDelete,
    search
  } 
}

const Item = (opts = {}) => {
  function* edit(payload) {
    const { id, item, index } = payload
    yield put(actions.initialize(id, item))
    yield put(valueActions.set(`${id}_itemWindow`, true))
    yield put(valueActions.set(`itemSearchResults_${id}`, null))
    yield put(valueActions.set(`itemSearch_${id}`, ''))
  }

  function* cancel(payload) {
    const { id } = payload
    yield put(valueActions.set(`${id}_itemWindow`, false))
  }

  function* confirmItem(payload) {
    const { id, form, field, values, schema } = payload

    const valid = yield select(state => formSelectors.valid(state, id))

    if(!valid) {
      yield put(actions.form.touchAll(id, schema))
      return
    }

    yield put(change(form, field, values))
    yield call(cancel, {
      id
    })
  }

  return {
    edit,
    cancel,
    confirmItem,
    search
  } 
}

const getController = (name, handlers) => {
  function* controller(payload) {
    const action = handlers[payload.action]
    if(!action) throw new Error(`form saga ${name}: no action found: ${payload.action}`)
    yield call(action, payload)
  }
  return controller
}

const FormSagas = (opts = {}) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const list = List(opts)
  const item = Item(opts)

  const listController = getController('list', list)
  const itemController = getController('item', item)

  return {
    list: listController,
    item: itemController,
  }
}

export default FormSagas