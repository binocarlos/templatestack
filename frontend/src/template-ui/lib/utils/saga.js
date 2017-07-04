import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

export const ForkListeners = (listeners = []) => {
  return function* forkListenerSaga() {
    yield all(listeners.map(listener => {
      function* listenAction() {
        yield takeLatest(listener[0], listener[1])
      }
      return fork(listenAction)
    }))
  }
}

export default ForkListeners