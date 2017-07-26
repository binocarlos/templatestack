import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import routerActions from '../router/actions'

const isResponseJson = (res) => res.headers['content-type'].indexOf('application/json') >= 0
const getErrorText = (error) => {
  const response = error.response
  if(!response) return error.toString()
  if(!isResponseJson(response)) return error.toString()
  return response.data.error || error.toString()
}

function* ApiSaga(opts = {}) {
  if(!opts.name) throw new Error('name needed for ApiSaga')
  if(!opts.actions) throw new Error('actions needed for ApiSaga')
  if(!opts.api) throw new Error('actions needed for ApiSaga')
  if(!opts.actions.request || !opts.actions.response || !opts.actions.error) throw new Error('request, response and error actions needed')
  
  const actions = opts.actions
  const api = opts.api
  const payload = opts.payload

  const state = yield select(state => state)
  yield put(actions.request(payload))
  yield put(routerActions.hook('apiRequest', {
    name: opts.name,
    payload
  }))

  let apiResult = null, apiError = null

  try {
    const data = yield call(api, payload, state)
    yield put(actions.response(data))
    yield put(routerActions.hook('apiResponse', {
      name: opts.name,
      data
    }))
    apiResult = data
  }
  catch(error) { 
    apiError = getErrorText(error)
    yield put(actions.error(apiError))
    yield put(routerActions.hook('apiError', {
      name: opts.name,
      error
    }))
  }

  const ret = {
    answer: apiResult,
    error: apiError
  }

  return ret
}

export default ApiSaga