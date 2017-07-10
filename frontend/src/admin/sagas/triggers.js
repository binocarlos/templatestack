import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import {
  getFormValues,
  isValid
} from 'redux-form'

import apiSaga from 'template-ui/lib/plugins/api/saga'

import api from '../api'
import * as actions from '../actions'
import loaders from './loaders'

/*

  USER TRIGGERS
  
*/

function* loginSubmit(action = {}) {
  const valid = yield select(isValid('login'))
  if(!valid) return
  const values = yield select(getFormValues('login'))

  const { answer, error } = yield call(apiSaga, {
    actions: actions.api.user.login,
    api: api.user.login
  })

  if(error) {
    yield put(actions.value.loginError(error))
    return
  }

  const user = yield call(loaders.userStatus)

  console.log('-------------------------------------------');
  console.log('-------------------------------------------');
  console.log('logged in!')

  console.log('-------------------------------------------');
  console.dir(user)

  
}

function* registerSubmit(action = {}) {
  const valid = yield select(isValid('register'))
  if(!valid) return
  const values = yield select(getFormValues('register'))

  const { answer, error } = yield call(apiSaga, {
    actions: actions.api.user.register,
    api: api.user.register
  })

  if(error) {
    yield put(actions.value.registerError(error))
    return
  }

  const user = yield call(loaders.userStatus)

  console.log('-------------------------------------------');
  console.log('-------------------------------------------');
  console.log('registered!')

  console.log('-------------------------------------------');
  console.dir(user)
  
}

const triggers = {
  loginSubmit,
  registerSubmit
}

export default triggers