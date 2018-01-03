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

    const { answer, error } = yield call(apiSaga, {
      name: `${name}Descendents`,
      handler: apis.descendents,
      payload: {
        namespace
      }
    })

    if(error) {
      yield put(systemActions.message(error))
      yield put(actions.tree.setData([]))
    }
    else {
      yield put(actions.tree.setData(answer))
    }
  }


  return {    
    descendents
  }
}

export default DiggerSagas
