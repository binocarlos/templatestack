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
  'search',
  'children',
  'descendents',
  'links',
  'create',
  'load',
  'save',
  'del',
]

const DiggerSagas = (opts = {}) => {

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

  function* descendents() {
    const namespace = yield select(state => routerSelectors.firstValue(state, 'namespace'))
    const type = opts.descendentType

    let { answer, error } = yield call(apiSaga, {
      name: `${name}Descendents`,
      handler: apis.descendents,
      payload: {
        namespace,
        type,
        tree: true
      }
    })

    if(error) {
      yield put(systemActions.message(error))
      yield put(actions.tree.setData([]))
    }
    else {

      if(opts.processTreeData) {
        answer = opts.processTreeData(answer)
      }
      yield put(actions.tree.setData(answer))
    }
  }

  function* list() {
    let searchForm = yield select(state => formSelectors.values(state, `${name}Search`))
    const namespace = yield select(state => routerSelectors.firstValue(state, 'namespace'))
    const viewid = yield select(state => routerSelectors.param(state, 'viewid'))

    searchForm = searchForm || {}

    const { answer, error } = yield call(apiSaga, {
      name: `${name}List`,
      handler: searchForm.search ? apis.descendents : apis.children,
      payload: {
        namespace,
        id: viewid,
        search: searchForm.search
      }
    })

    if(error) {
      yield put(systemActions.message(error))
      yield put(actions.list.setData([]))
    }
    else {
      yield put(actions.list.setData(answer))
      yield put(formActions.initialize(`${name}Search`, {}))
    }
  }

  function* load() {
    const namespace = yield select(state => routerSelectors.firstValue(state, 'namespace'))
    const type = yield select(state => routerSelectors.param(state, 'type'))
    const id = yield select(state => routerSelectors.param(state, 'id'))
    if(id) {
      const { answer, error } = yield call(apiSaga, {
        name: `${name}Load`,
        handler: apis.load,
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
        initialData = yield call(opts.loadInitialData, {
          namespace,
          type
        })
      }
      yield put(formActions.initialize(name, initialData))
    }
  }

  function* save() {
    const namespace = yield select(state => routerSelectors.firstValue(state, 'namespace'))
    const viewid = yield select(state => routerSelectors.param(state, 'viewid'))
    const itemData = yield select(state => formSelectors.values(state, name))

    const saveData = Object.assign({}, itemData, {
      namespace
    })

    const apiName = itemData.id ? `${name}Save` : `${name}Create`
    const apiHandler = itemData.id ? apis.save : apis.create

    const { answer, error } = yield call(apiSaga, {
      name: apiName,
      handler: apiHandler,
      payload: {
        id: viewid,
        data: saveData
      }
    })

    if(error) {
      yield put(systemActions.message(error))
    }
    else {
      yield put(routerActions.hook(`${name}Cancel`))
      yield put(systemActions.message(`item saved`))
    }
  }


  const digger = {    
    descendents,
    list,
    load,
    save,
  }

  return digger
}

export default DiggerSagas
