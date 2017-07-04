import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import actionFactory, { ID } from './actions'

function* FormSaga(opts = {}) {
  if(!opts.actions) throw new Error('actions needed for FormSaga')
  if(!opts.getSchema) throw new Error('getSchema needed for FormSaga')

  const actions = opts.actions
  const getSchema = opts.getSchema
  const id = opts.id || ID

  yield put(actions.request(payload))

  let apiResult = null, apiError = null

  try {
    const data = yield call(api, payload)
    yield put(actions.response(data))
    apiResult = data
  }
  catch(error) {
    yield put(actions.error(error))
    apiError = error
  }

  const ret = {
    answer: apiResult,
    error: apiError
  }

  return ret
}

export default FormSaga