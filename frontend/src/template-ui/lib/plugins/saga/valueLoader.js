import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import valueActions from '../value/actions'
import ApiLoader from './apiLoader'

const ValueLoaderSaga = (opts = {}) => {
  if(!opts.name) throw new Error('name option needed')

  function* answerHandler(answer) {
    const result = opts.mapResult ?
      opts.mapResult(answer) :
      answer
    yield put(valueActions.set(opts.name, result))
    return result
  }

  return ApiLoader({
    actions: opts.actions,
    api: opts.api,
    handler: answerHandler
  })
}

export default ValueLoaderSaga