import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import * as actions from '../actions'
import loaders from './loaders'

function* initialize() {
  yield all([
    call(loaders.config),
    call(loaders.userStatus)
  ])
  yield put(actions.value.initialized.set(true))
}

export default initialize