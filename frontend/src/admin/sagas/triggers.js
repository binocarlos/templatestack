import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import {
  getFormValues,
  isValid
} from 'redux-form'

import apiSaga from 'template-ui/lib/plugins/api/saga'

import api from '../api'
import * as actions from '../actions'

function* exampleTrigger(payload) {
  console.log('-------------------------------------------');
  console.log('-------------------------------------------');
  console.log('trigger yo')
  console.dir(payload)
}

function* loginError(error) {
  yield put(actions.value.set('loginError', error))
}

function* registerError(error) {
  yield put(actions.value.set('registerError', error))
}

function* login(user) {
  console.log('-------------------------------------------');
  console.log('-------------------------------------------');
  console.log('logged in')
  console.dir(user)
}

function* register(user) {
  console.log('-------------------------------------------');
  console.log('-------------------------------------------');
  console.log('registered')
  console.dir(user)
}

const triggers = {
  exampleTrigger,
  loginError,
  registerError,
  login,
  register
}

export default triggers