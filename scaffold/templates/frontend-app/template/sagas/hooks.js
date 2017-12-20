import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import { 
  getRouteInfoHooks,
  authenticateRoute
} from 'template-ui/lib/plugins2/router/tools'

import consoleTools from 'template-ui/lib/utils/console'

import AuthSaga from 'template-ui/lib/plugins2/auth/saga'
import FormSagas from 'template-ui/lib/plugins2/form/sagas'
import systemSagas from 'template-ui/lib/plugins2/system/sagas'

import UserSaga from './user'
import TokenApiWrapper from './tokenApiWrapper'

import config from '../config'
import actions from '../actions'
import selectors from '../selectors'

function* authLoginSuccess() {
  yield put(actions.router.redirect('/dashboard'))
}

function *googleLogin() {
  document.location = config.login
}

function* authLogout() {
  document.location = config.logout + '?redirect=' + config.basepath
}

const Hooks = (opts = {}) => {

  const apis = opts.apis

  const auth = AuthSaga({
    apis: apis.auth,
    formTouchAll: actions.formutils.touchAll
  })

  const form = FormSagas()

  const user = UserSaga({
    apis: apis.user
  })

  const tokenApiWrapper = TokenApiWrapper({
    refreshToken: user.refreshToken
  })

  const hooks = {
    
    // system sagas
    message: systemSagas.message,

    // user sagas
    listUsers: user.list,

    // auth sagas
    authLogout,
    authLoginSuccess,
    authLoginSubmit: googleLogin,
    authenticateRoute: auth.checkRoute,

  }

  function* initialize() {
    yield call(auth.status)
    const loggedIn = yield select(selectors.auth.loggedIn)
    if(loggedIn) {
      yield call(user.loadToken)
    }
  }

  return {
    hooks,
    initialize,
    getHook: (name) => hooks[name],
    getRouteHooks: (routeInfo, mode = 'enter') => {
      const routeInfoHooks = getRouteInfoHooks(routeInfo, mode)
      return mode == 'enter' ? 
        ['authenticateRoute'].concat(routeInfoHooks) :
        routeInfoHooks
    }
    
  }
}

export default Hooks