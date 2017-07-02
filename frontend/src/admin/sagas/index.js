import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import apiResolveSaga from 'template-ui/lib/plugins/api/resolveSaga'

import api from '../api'
import * as actions from '../actions'
import * as selectors from '../selectors'

/*

  WORKERS
  
*/
function* loadConfig() {
  const { result, error } = yield call(apiResolveSaga, {
    actions: actions.api.config.load,
    api: api.config.load
  })
  if(error) throw new Error(error)
  yield put(actions.value.set('config', result))
  return result
}

function* loadUserStatus() {
  const { result, error } = yield call(apiResolveSaga, {
    actions: actions.api.user.status,
    api: api.user.status
  })
  if(error) throw new Error(error)
  yield put(actions.value.set('user', result))
  return result
}

/*

  WATCHERS
  
*/

function* initialize() {
  yield all([
    call(loadConfig),
    call(loadUserStatus)
  ])
  yield put(actions.value.set('initialized', true))
}

export default function* root() {
  yield all([
    fork(initialize)
  ])
}
