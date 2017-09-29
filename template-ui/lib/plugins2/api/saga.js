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

const loadingState = (name) => ({
  name,
  status: 'loading',
  error: null
})

const errorState = (name, error) => ({
  name,
  status: 'loaded',
  error
})

const loadedState = (name) => ({
  name,
  status: 'loaded',
  error: null
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
  yield call(writeState, loadingState(name))

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
    yield call(writeState, loadedState(name))
  }
  catch(error) { 
    apiError = getErrorText(error)
    consoleUtils.devRun(() => {
      console.log(`API ERROR: ${name}`)
      console.log(apiError)
    })
    yield call(writeState, errorState(name, apiError))
  }

  const ret = {
    answer: apiResult,
    error: apiError
  }

  return ret
}

export default ApiSaga