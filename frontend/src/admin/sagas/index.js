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
    actions: actions.api.config.get,
    api: api.config.get,
    payload: {q:4}
  })

  console.log('-------------------------------------------');
  console.log('-------------------------------------------');
  console.dir('result')
  console.dir(result)
  console.dir('error')
  console.dir(error)

}

/*

  WATCHERS
  
*/

function* initialize() {
  yield call(loadConfig)
}

export default function* root() {
  yield all([
    fork(initialize)
  ])
}
