import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import actions from './actions'

function* message(text) {
  yield put(actions.message(text))
}

const SystemSagas = {
  message
}

export default SystemSagas