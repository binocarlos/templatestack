import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'
import api from '../api'
import * as actions from '../actions'
import * as selectors from '../selectors'

/*

  WORKERS
  
*/
function* loadConfig() {
  console.log('-------------------------------------------');
  console.log('load config')
}

/*

  WATCHERS
  
*/
function* watchLoadConfig() {
  yield takeLatest(actions.api.config.request.getType(), loadConfig)
}

export default function* root() {
  yield all([
    fork(watchLoadConfig)
  ])
}
