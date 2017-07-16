import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import {
  getFormValues,
  isValid
} from 'redux-form'

import routerActions from '../router/actions'
import apiSaga from '../api/saga'
import valueActions from '../value/actions'
import ValueLoaderSaga from '../saga/valueLoader'
import ApiLoaderSaga from '../saga/apiLoader'

const AuthSagas = (opts = {}) => {

  opts = Object.assign({}, {
    userValueName: 'user',
    logoutUrl: '/api/v1/auth/logout',
    basepath: '/',
    handleLogout: () => {
      document.location = opts.logoutUrl + '?redirect=' + opts.basepath
    },
    loginForm: 'login',
    registerForm: 'register'
  }, opts)

  const actions = opts.actions
  const apis = opts.apis

  if(!actions) throw new Error('actions needed')
  if(!apis) throw new Error('apis needed')

  function* logout() {
    opts.handleLogout()
  }

  const status = ValueLoaderSaga({
    name: opts.userValueName,
    actions: actions.status,
    api: apis.status,
    mapResult: (answer) => answer.loggedIn ? answer.data : null
  })

  function* login(action = {}) {
    const valid = yield select(isValid(opts.loginForm))
    if(!valid) return
    const values = yield select(getFormValues(opts.loginForm))
    const { answer, error } = yield call(apiSaga, {
      actions: actions.login,
      api: apis.login,
      payload: values
    })

    if(error) {
      yield put(routerActions.trigger('loginError', user))
      return
    }

    const user = yield call(status)
    yield put(routerActions.trigger('loginSuccess', user))
  }

  function* register(action = {}) {
    const valid = yield select(isValid('register'))
    if(!valid) return
    const values = yield select(getFormValues('register'))

    const { answer, error } = yield call(apiSaga, {
      actions: actions.register,
      api: apis.register,
      payload: values
    })

    if(error) {
      yield put(routerActions.trigger('registerError', user))
      return
    }

    const user = yield call(status)
    yield put(routerActions.trigger('registerSuccess', user))    
  }

  return {
    logout,
    status,
    login,
    register
  }
 
}

export default AuthSagas