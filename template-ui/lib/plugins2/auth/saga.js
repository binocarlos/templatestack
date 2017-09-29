import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import options from 'template-tools/src/utils/options'

import apiSaga from '../api/saga'
import systemSagas from '../system/sagas'

import valueActions from '../value/actions'
import routerActions from '../router/actions'

import formSelectors from '../form/selectors'
import routerSelectors from '../router/selectors'

import actions from './actions'
import selectors from './selectors'

const REQUIRED = [
  'apis',
  'formTouchAll'
]

const REQUIRED_APIS = [
  'status',
  'login',
  'register'
]

const DEFAULTS = {
  loginForm: 'authLogin',
  registerForm: 'authRegister',
  loginSuccessHook: 'authLoginSuccess',
  registerSuccessHook: 'authRegisterSuccess'
}

const AuthSagas = (opts = {}) => {

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const apis = options.processor(opts.apis, {
    required: REQUIRED_APIS
  })

  function* touchForm(name) {
    if(opts.formTouchAll) {
      yield put(opts.formTouchAll(name))
    }
  }

  function* runLogin(values = {}) {
    const ret = yield call(apiSaga, {
      name: 'authLogin',
      handler: apis.login,
      payload: values
    })
    return ret
  }

  function* autoLogin() {
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
  }

  function* status(action = {}) {
    yield call(autoLogin)
    const { answer, error } = yield call(apiSaga, {
      name: 'authStatus',
      handler: apis.status
    })
    if(error) return
    const user = answer.loggedIn ? answer.data : null
    yield put(actions.setUser(user))
    return user
  }

  function* login(action = {}) {
    const valid = yield select(state => formSelectors.valid(state, opts.loginForm))
    if(!valid) {
      yield call(touchForm, opts.loginForm)
      yield call(systemSagas.message, 'Invalid Form Details')
      return
    }
    const values = yield select(state => formSelectors.values(state, opts.loginForm))
    const { answer, error } = yield call(runLogin, values)
    if(error) {
      yield call(systemSagas.message, error.toString())
      return
    }
    const user = yield call(status)
    yield put(routerActions.hook(opts.loginSuccessHook, user))
    return user
  }


  function* register(action = {}) {
    const valid = yield select(state => formSelectors.valid(state, opts.registerForm))
    if(!valid) {
      yield call(touchForm, opts.registerForm)
      yield call(systemSagas.message, 'Invalid Form Details')
      return
    }
    const values = yield select(state => formSelectors.values(state, opts.registerForm))
    const { answer, error } = yield call(apiSaga, {
      name: 'authRegister',
      handler: apis.register,
      payload: values
    })
    if(error) {
      yield call(systemSagas.message, error.toString())
      return
    }
    const user = yield call(status)
    yield put(routerActions.hook(opts.registerSuccessHook, user))    
    return user
  }

  function* checkRoute() {
    const userSetting = yield select(state => routerSelectors.firstValue(state, 'user'))
    if(typeof(userSetting) != 'boolean') return true
    const loggedIn = yield select(state => selectors.loggedIn(state))
    const isRouteAuthenticated = loggedIn == userSetting
    if(!isRouteAuthenticated) {
      yield put(routerSelectors.redirect('/'))
      return false
    }
    return true
  }

  return {
    status,
    login,
    register,
    checkRoute
  }
 
}

export default AuthSagas