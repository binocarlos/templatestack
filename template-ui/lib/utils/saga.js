import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

export const ForkListeners = (listeners = [], effect = takeEvery) => {
  return function* forkListenerSaga() {
    yield all(listeners.map(listener => {
      function* listenAction() {
        yield effect(listener[0], listener[1])
      }
      return fork(listenAction)
    }))
  }
}

export const PatternHandlers = (opts = {}) => {

  const handlers = opts.handlers || {}
  const id = opts.id
  const effect = opts.effect || takeEvery

  const pattern = (action) => action._genericid == id
  const extract = (action) => action._genericaction

  function* mainHandler(action) {
    const handlerName = extract(action)
    const handler = handlers[handlerName]
    if(!handler) return
    yield call(handler, action)
  }

  function* listen() {
    yield effect(pattern, mainHandler)
  }

  return listen
}

export default PatternHandlers