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

  const payload = req.payload
  const searchString = payload.search
  const api = req.api
  const id = req.id

  yield put(valueActions.set(`${id}_itemSearch`, searchString))

  if(!searchString) {
    yield put(valueActions.set(`${id}_itemSearchResults`, null))
    return
  }

  const state = yield select(state => state)
  const extraParams = req.getExtraSearchArguments ? req.getExtraSearchArguments(state) : {}

  const finalPayload = Object.assign({}, {
    search: searchString
  }, extraParams)

  let { answer, error } = yield call(apiSaga, {
    name: `itemSearchApi_${id}`,
    handler: api,
    payload: finalPayload,
  })
  if(error) {
    yield put(systemActions.message(error))
    yield put(valueActions.set(`${id}_itemSearchResults`, null))
  }
  else {
    yield put(valueActions.set(`${id}_itemSearchResults`, answer))
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
    yield put(valueActions.set(`${id}_itemSearch`, ''))
    yield put(valueActions.set(`${id}_itemSearchResults`, null))
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

  // this is used for inline table editing
  function* updateItemValue(payload) {
    const { id, form, field, itemIndex, itemField, itemValue } = payload
    const allValues = yield select(state => selectors.values(state, form))
    const list = allValues[field]
    const item = list[itemIndex]

    const newItem = Object.assign({}, item, {
      [itemField]: itemValue
    })

    yield put(arraySplice(form, field, itemIndex, 1, newItem))
  }

  return {
    add,
    edit,
    del,
    selected,
    cancel,
    confirmItem,
    confirmDelete,
    search,
    updateItemValue
  } 
}

const Item = (opts = {}) => {
  function* edit(payload) {
    const { id, item, index } = payload
    yield put(actions.initialize(id, item))
    yield put(valueActions.set(`${id}_itemWindow`, true))
    yield put(valueActions.set(`${id}_itemSearch`, ''))
    yield put(valueActions.set(`${id}_itemSearchResults`, null))
  }

  function* cancel(payload) {
    const { id } = payload
    yield put(valueActions.set(`${id}_itemWindow`, false))
    yield put(valueActions.set(`${id}_itemSearch`, ''))
    yield put(valueActions.set(`${id}_itemSearchResults`, null))
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