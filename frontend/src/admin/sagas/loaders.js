import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import apiSaga from 'template-ui/lib/plugins/api/saga'

import api from '../api'
import * as actions from '../actions'

/*

  DATA LOADERS
  
*/

function* config(payload = {}) {
  const { answer, error } = yield call(apiSaga, {
    actions: actions.api.config.load,
    api: api.config.load
  })
  if(error) throw new Error(error)
  yield put(actions.value.config.set(answer))
  return answer
}

function* userStatus(payload = {}) {
  const { answer, error } = yield call(apiSaga, {
    actions: actions.api.user.status,
    api: api.user.status
  })
  if(error) throw new Error(error)
  const loggedIn = answer.loggedIn ? true : false
  const user = loggedIn ? answer.user : null
  yield put(actions.value.user.set(user))
  return answer
}

const loaders = {
  config,
  userStatus
}

export default loaders