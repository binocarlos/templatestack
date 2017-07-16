import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import apiSaga from '../api/saga'

const ApiLoaderSaga = (opts = {}) => {
  function* loaderSaga(payload = {}) {
    let { answer, error } = yield call(apiSaga, {
      actions: opts.actions,
      api: opts.api
    })
    if(error) throw new Error(error)
    if(opts.handler) {
      answer = yield call(opts.handler, answer)
    }
    return answer
  }
  return loaderSaga
}

export default ApiLoaderSaga