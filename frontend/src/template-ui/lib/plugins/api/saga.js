import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

const isResponseJson = (res) => res.headers['content-type'].indexOf('application/json') >= 0
const getErrorText = (error) => {
  const response = error.response
  if(!response) return error.toString()
  if(!isResponseJson(response)) return error.toString()
  return response.data.error || error.toString()
}

function* ApiSaga(opts = {}) {
  if(!opts.actions) throw new Error('actions needed for ApiResolverSaga')
  if(!opts.api) throw new Error('actions needed for ApiResolverSaga')
  if(!opts.actions.request || !opts.actions.response || !opts.actions.error) throw new Error('request, response and error actions needed')
  
  const actions = opts.actions
  const api = opts.api
  const payload = opts.payload

  yield put(actions.request(payload))

  let apiResult = null, apiError = null

  try {
    const data = yield call(api, payload)
    yield put(actions.response(data))
    apiResult = data
  }
  catch(error) { 
    apiError = getErrorText(error)
    yield put(actions.error(apiError))
  }

  const ret = {
    answer: apiResult,
    error: apiError
  }

  return ret
}

export default ApiSaga