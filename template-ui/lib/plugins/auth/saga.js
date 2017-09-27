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
    loginForm: 'authLogin',
    registerForm: 'authRegister'
  }, opts)

  const actions = opts.actions
  const apis = opts.apis

  if(!actions) throw new Error('actions needed')
  if(!apis) throw new Error('apis needed')

  function* logout() {
    opts.handleLogout()
  }

  function* message(text) {
    if(opts.messageHook) {
      yield put(routerActions.hook(opts.messageHook, text))
    }
  }

  function* touchForm(name) {
    if(opts.touchAllAction) {
      yield put(opts.touchAllAction(name))
    }
  }

  function* status(action = {}) {
    const routerState = yield select(state => state.router)
    const query = routerState.query || {}

    const autoUsername = query.autoUsername
    const autoPassword = query.autoPassword

    if(autoUsername && autoPassword) {
      yield call(runLogin, {
        username: autoUsername,
        password: autoPassword
      })
    }

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
    if(!valid) {
      yield call(touchForm, opts.loginForm)
      yield call(message, 'Invalid Form Details')
      return
    }
    const values = yield select(getFormValues(opts.loginForm))
    const { answer, error } = yield call(runLogin, values)
    if(error) {
      yield put(routerActions.hook('authLoginError', error))
      yield call(message, error.toString())
      return
    }
    const user = yield call(status)
    yield put(routerActions.hook('authLoginSuccess', user))
    return user
  }

  function* runLogin(values = {}) {
    const ret = yield call(apiSaga, {
      name: 'authLogin',
      actions: actions.login,
      api: apis.login,
      payload: values
    })
    return ret
  }

  function* register(action = {}) {
    const valid = yield select(isValid(opts.registerForm))
    if(!valid) {
      yield call(touchForm, opts.registerForm)
      yield call(message, 'Invalid Form Details')
      return
    }
    const values = yield select(getFormValues(opts.registerForm))

    const { answer, error } = yield call(apiSaga, {
      name: 'authRegister',
      actions: actions.register,
      api: apis.register,
      payload: values
    })

    if(error) {
      yield put(routerActions.hook('authRegisterError', user))
      yield call(message, error.toString())
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