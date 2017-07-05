import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import initialize from './initialize'
import router from './router'
import form from './form'

export default function* root() {
  const handlers = [
    initialize,
    router,
    form
  ]
  yield all(handlers.map(fork))
}