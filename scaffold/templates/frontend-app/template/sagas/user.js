import { take, put, call, fork, select, all, takeLatest, takeEvery, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import options from 'template-tools/src/utils/options'

import apiSaga from 'template-ui/lib/plugins2/api/saga'
import formUtils from 'template-ui/lib/plugins2/form/utils'

import forms from '../forms'
import config from '../config'
import actions from '../actions'
import selectors from '../selectors'

const REQUIRED_APIS = [
  'list',
  'get',
  'save',
  'loadToken',
  'refreshToken',
]

const UserSagas = (opts = {}) => {
  if(!opts.apis) throw new Error('project saga requires a apis option')

  const apis = options.processor(opts.apis, {
    required: REQUIRED_APIS
  })

  function* list() {
    const { answer, error } = yield call(apiSaga, {
      name: 'userList',
      handler: apis.list,
      payload: {}
    })
    if(error) {
      yield put(actions.system.message(error))
      yield put(actions.user.list.setData([]))
    }
    else {
      yield put(actions.user.list.setData(answer))
    }
  }

  function* loadToken() {
    const { answer, error } = yield call(apiSaga, {
      name: 'loadToken',
      handler: apis.loadToken
    })
    if(error || !answer.ok) {
      yield put(actions.system.message(error || 'no token found'))
      yield put(actions.user.token.setData(''))
    }
    else {
      yield put(actions.user.token.setData(answer.token))
    }
  }

  function* refreshToken() {
    const { answer, error } = yield call(apiSaga, {
      name: 'refreshToken',
      handler: apis.refreshToken
    })
    if(error || !answer.ok) {
      yield put(actions.system.message(error || 'no token found'))
      yield put(actions.user.token.setData(''))
    }
    else {
      yield put(actions.user.token.setData(answer.token))
    }
  }

  function* edit() {
    const id = yield select(state => selectors.router.param(state, 'id'))

    console.log('-------------------------------------------');
    console.log('-------------------------------------------');
    console.dir(id)
  }

  function* save() {
    const valid = yield select(state => selectors.form.valid(state, 'user'))

    if(!valid) {
      yield put(actions.form.touchAll('user', forms.user))
      return
    }

    const values = yield select(state => selectors.form.values(state, 'user'))

    console.log(JSON.stringify(values, null, 4))
    
  }

  return {
    list,
    edit,
    save,
    loadToken,
    refreshToken
  }
}

export default UserSagas
