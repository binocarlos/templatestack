import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import apiSaga from 'template-ui/lib/plugins/api/saga'

import api from '../api'
import * as actions from '../actions'

/*

  USER TRIGGERS
  
*/

function* loginSubmit(action = {}) {

  console.log('-------------------------------------------');
  console.log('-------------------------------------------');
  console.log('login submit')
  console.dir(action)
  
}

const triggers = {
  loginSubmit
}

export default triggers