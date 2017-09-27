import { take, put, call, fork, select, all, takeLatest, takeEvery, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import config from '../config'
import * as actions from '../actions'
import * as selectors from '../selectors'

const REQUIRED_APIS = [
  'list',
  'get',
  'create',
  'save',
  'del',
  'activate'
]

const InstallationSagas = (opts = {}) => {
  if(!opts.apis) throw new Error('installation saga requires a api option')
  const apis = opts.apis
  REQUIRED_APIS.forEach(name => {
    if(!apis[name]) throw new Error(`${name} api required`)
  })

  function* setData(payload) {
    yield put(actions.value.set('installationsLoaded', true))
    yield put(actions.value.set('installations', payload))
  }

  function* resetData() {
    yield put(actions.value.set('installationsLoaded', false))
    yield put(actions.value.set('installations', []))
  }

  function* list() {    
    const { answer, error } = yield call(apis.list.loader)
    if(error) {
      yield call(resetData)
    }
    else {
      yield call(setData, answer)
    }
  }

  return {
    list
  }
}

export default InstallationSagas
