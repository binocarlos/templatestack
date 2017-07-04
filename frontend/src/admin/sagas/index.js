import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import RouterSaga from 'template-ui/lib/plugins/router/saga'
import apiSaga from 'template-ui/lib/plugins/api/saga'

import api from '../api'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { redirectHandlers } from '../routes'

/*

  DATA LOADERS
  
*/

function* loadConfig() {
  const { answer, error } = yield call(apiSaga, {
    actions: actions.api.config.load,
    api: api.config.load
  })
  if(error) throw new Error(error)
  yield put(actions.value.config.set(answer))
  return answer
}

function* loadUserStatus() {
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

/*

  WATCHERS
  
*/

function* initialize() {
  yield all([
    call(loadConfig),
    call(loadUserStatus)
  ])
  yield put(actions.value.initialized.set(true))
}

export default function* root() {
  yield all([
    fork(initialize),
    fork(RouterSaga({
      
    }))
  ])
}



  /*
  
    
  const initialLocation = store.getState().router
  if (initialLocation) {
    store.dispatch(initializeCurrentLocation(initialLocation))  
  }
    
  */