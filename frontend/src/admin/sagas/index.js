import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import RouterSaga from 'template-ui/lib/plugins/router/saga'
import apiSaga from 'template-ui/lib/plugins/api/saga'

import api from '../api'
import * as actions from '../actions'
import * as selectors from '../selectors'

import redirects from './redirects'
import loaders from './loaders'

function* initialize() {
  yield all([
    call(loaders.config),
    call(loaders.userStatus)
  ])
  yield put(actions.value.initialized.set(true))
}

export default function* root() {
  yield all([
    fork(initialize),
    fork(RouterSaga({
      redirects,
      loaders
    }))
  ])
}



  /*
  
    
  const initialLocation = store.getState().router
  if (initialLocation) {
    store.dispatch(initializeCurrentLocation(initialLocation))  
  }
    
  */