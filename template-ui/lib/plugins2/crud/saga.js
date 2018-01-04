import { take, put, call, fork, select, all, takeLatest, takeEvery, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import options from 'template-tools/src/utils/options'

import systemActions from '../system/actions'
import formActions from '../form/actions'
import routerActions from '../router/actions'
import apiSaga from '../api/saga'
import routerSelectors from '../router/selectors'
import formSelectors from '../form/selectors'
import formUtils from '../form/utils'

const REQUIRED = [
  'name',
  'actions',
  'selectors',
  'apis',
]

const REQUIRED_APIS = [
  'list',
  'get',
  'create',
  'save',
  'del',
]

const CrudSagas = (opts = {}) => {

  opts = options.processor(opts, {
    required: REQUIRED
  })

  const apis = options.processor(opts.apis, {
    required: REQUIRED_APIS
  })

  const {
    name,
    actions,
    selectors
  } = opts

  function* list() {
    const searchForm = yield select(state => formSelectors.values(state, `${name}Search`))
    const { answer, error } = yield call(apiSaga, {
      name: `${name}List`,
      handler: apis.list,
      payload: searchForm,
      keepPayload: true,
    })
    if(error) {
      yield put(systemActions.message(error))
      yield put(actions.list.setData([]))
    }
    else {
      yield put(actions.list.setData(answer))
    }
    yield put(formActions.initialize(`${name}Search`, {}))
  }

  function* load() {
    const id = yield select(state => routerSelectors.param(state, 'id'))
    if(id) {
      const { answer, error } = yield call(apiSaga, {
        name: `${name}Load`,
        handler: apis.get,
        payload: {
          id
        }
      })

      if(error) {
        yield put(systemActions.message(error))
      }
      else {
        yield put(formActions.initialize(name, answer))
      }
    }
    else {
      let initialData = {}
      if(opts.loadInitialData) {
        initialData = yield call(opts.loadInitialData)
      }
      yield put(formActions.initialize(name, initialData))
    }
  }

  function* save() {
    const itemData = yield select(state => formSelectors.values(state, name))

    const apiName = itemData.id ? `${name}Save` : `${name}Create`
    const apiHandler = itemData.id ? apis.save : apis.create

    const { answer, error } = yield call(apiSaga, {
      name: apiName,
      handler: apiHandler,
      payload: {
        id: itemData.id,
        data: itemData
      }
    })

    if(error) {
      yield put(systemActions.message(error))
    }
    else {
      yield put(routerActions.hook(`${name}Cancel`))
      yield put(systemActions.message(`items saved`))
    }
  }

  function* delItem(id) {
    const { answer, error } = yield call(apiSaga, {
      name: `${name}Delete`,
      handler: apis.del,
      payload: {
        id
      }
    })
    if(error) {
      yield put(systemActions.message(error))
    }
  }

  function* del(payload) {
    const selectedItems = yield select(state => selectors.list.selectedItems(state))
    while(selectedItems.length > 0) {
      const item = selectedItems.shift()
      yield call(delItem, item.id)
    }
    yield put(systemActions.message(`items deleted`))
    yield put(actions.list.setSelected([]))
    yield call(list)
  }

  function* tableAction(payload) {
    if(opts.tableAction) {
      yield call(opts.tableAction, payload)
    }
  }

  return {
    list,
    load,
    save,
    del,
    tableAction
  }
}

export default CrudSagas
