import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import options from 'template-tools/src/utils/options'
import valueActions from '../value/actions'
import consoleUtils from '../../utils/console'

const isResponseJson = (res) => res.headers['content-type'].indexOf('application/json') >= 0
const getErrorText = (error) => {
  const response = error.response
  if(!response) return error.toString()
  if(!isResponseJson(response)) return error.toString()
  return response.data.error || error.toString()
}

const getValueKey = (name) => `api_${name}`

const loadingState = (name, payload, keepPayload) => ({
  name,
  status: 'loading',
  error: null,
  payload: keepPayload ? payload : null
})

const errorState = (name, error, payload, keepPayload) => ({
  name,
  status: 'loaded',
  error,
  payload: keepPayload ? payload : null
})

const loadedState = (name, payload, keepPayload) => ({
  name,
  status: 'loaded',
  error: null,
  payload: keepPayload ? payload : null
})

const REQUIRED = [
  'name',
  'handler'
]

function* ApiSaga(opts = {}) {
  opts = options.processor(opts, {
    required: REQUIRED
  })

  const {
    name,
    handler,
    payload
  } = opts

  function* writeState(data) {
    yield put(valueActions.set(getValueKey(name), data))
  }
  
  const state = yield select(state => state)
  yield call(writeState, loadingState(name, payload, opts.keepPayload))

  let apiResult = null, apiError = null

  consoleUtils.devRun(() => {
    console.log(`API REQUEST: ${name}`)
    console.dir(payload)
  })

  try {
    const data = yield call(handler, payload, state)
    apiResult = data
    consoleUtils.devRun(() => {
      console.log(`API RESPONSE: ${name}`)
      console.dir(apiResult)
    })
    yield call(writeState, loadedState(name, payload, opts.keepPayload))
  }
  catch(error) { 
    apiError = getErrorText(error)
    consoleUtils.devRun(() => {
      console.log(`API ERROR: ${name}`)
      console.log(apiError)
    })
    yield call(writeState, errorState(name, apiError, payload, opts.keepPayload))
  }

  const ret = {
    answer: apiResult,
    error: apiError
  }

  return ret
}

export default ApiSaga