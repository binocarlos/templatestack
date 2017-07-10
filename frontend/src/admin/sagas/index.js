import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import initialize from './initialize'
import router from './router'

export default function* root() {
  const handlers = [
    initialize,
    router
  ]
  yield all(handlers.map(fork))
}