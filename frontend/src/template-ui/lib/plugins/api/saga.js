import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'
import { TYPES } from './actions'

function* ApiResolverSaga(opts = {}) {
  if(!opts.actions) throw new Error('actions needed for ApiResolverSaga')
  if(!opts.api) throw new Error('actions needed for ApiResolverSaga')
  if(!opts.actions.request || !opts.actions.response || !opts.actions.error) throw new Error('request, response and error actions needed')
  
  const actions = opts.actions
  const api = opts.api
  const payload = opts.payload

  yield put(actions.request(payload))

  let apiResult, apiError = null

  try {
    const data = yield call(api, payload)
    yield put(actions.response(data))
    apiResult = data
  }
  catch(error) {
    yield put(actions.error(error))
    apiError = error
  }

  return {
    answer: apiResult,
    error: apiError
  }
}

export default ApiResolverSaga