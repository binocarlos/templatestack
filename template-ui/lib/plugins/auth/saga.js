import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import {
  getFormValues,
  isValid
} from 'redux-form'

import routerActions from '../router/actions'
import apiSaga from '../api/saga'
import valueActions from '../value/actions'

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

  function* status(action = {}) {
    const { answer, error } = yield call(apiSaga, {
      name: 'authStatus',
      actions: actions.status,
      api: apis.status
    })
    if(error) return
    const user = answer.loggedIn ? answer.data : null
    if(user) {
      yield put(routerActions.hook('authStatusSuccess', user))
    }
    else {
      yield put(routerActions.hook('authStatusFailure'))
    }
    yield put(valueActions.set(opts.userValueName, user))
    return user
  }

  function* login(action = {}) {
    const valid = yield select(isValid(opts.loginForm))
    if(!valid) return
    const values = yield select(getFormValues(opts.loginForm))
    const { answer, error } = yield call(apiSaga, {
      name: 'authLogin',
      actions: actions.login,
      api: apis.login,
      payload: values
    })
    if(error) {
      yield put(routerActions.hook('authLoginError', error))
      return
    }
    const user = yield call(status)
    yield put(routerActions.hook('authLoginSuccess', user))
    return user
  }

  function* register(action = {}) {
    const valid = yield select(isValid('register'))
    if(!valid) return
    const values = yield select(getFormValues('register'))

    const { answer, error } = yield call(apiSaga, {
      name: 'authRegister',
      actions: actions.register,
      api: apis.register,
      payload: values
    })

    if(error) {
      yield put(routerActions.hook('authRegisterError', user))
      return
    }

    const user = yield call(status)
    yield put(routerActions.hook('authRegisterSuccess', user))    
    return user
  }

  return {
    logout,
    status,
    login,
    register
  }
 
}

export default AuthSagas