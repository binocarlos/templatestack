import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import {
  getFormValues,
  isValid
} from 'redux-form'

import apiSaga from 'template-ui/lib/plugins/api/saga'
import consoleTools from 'template-ui/lib/utils/console'

import config from '../config'
import * as actions from '../actions'
import * as selectors from '../selectors'

const Logger = (type) => {
  function* logger(req) {
    consoleTools.devRun(() => {
      console.log(`api ${type}: ${req.name}`)
      console.dir(req)
    })
  }
  return logger
}


const Hooks = (opts = {}) => {

  const auth = opts.auth

  function* authLoginSuccess(user) {
    yield put(actions.router.redirect('/dashboard'))
  }

  function* authRegisterSuccess(user) {
    yield put(actions.router.redirect('/dashboard'))
  }  

  function* authenticateRoute() {
    const userSetting = yield select(state => selectors.router.firstValue(state, 'user'))
    // this route has no opinion about the user
    if(typeof(userSetting) != 'boolean') return
    const user = yield select(state => selectors.valueSelector(state, 'user'))
    const hasUser = user ? true : false
    const isRouteAuthenticated = hasUser == userSetting
    if(!isRouteAuthenticated) {
      yield put(actions.router.push(config.authRedirect || '/'))
    }
  }

  return {
    routerChanged: [
      authenticateRoute
    ],
    authLogout: auth.logout,
    authLoginSubmit: auth.login,
    authLoginSuccess,
    authRegisterSubmit: auth.register,
    authRegisterSuccess,
    apiRequest: Logger('request'),
    apiResponse: Logger('response'),
    apiError: Logger('error')
  }
}

export default Hooks