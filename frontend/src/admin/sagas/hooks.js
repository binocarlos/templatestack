import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import { 
  getRouteInfoHooks,
  authenticateRoute
} from 'template-ui/lib/plugins2/router/tools'

import consoleTools from 'template-ui/lib/utils/console'

import AuthSaga from 'template-ui/lib/plugins2/auth/saga'
import FormSagas from 'template-ui/lib/plugins2/form/sagas'
import systemSagas from 'template-ui/lib/plugins2/system/sagas'

import ProjectSaga from './project'

import config from '../config'
import actions from '../actions'

function* authLoginSuccess() {
  yield put(actions.router.redirect('/dashboard'))
}

function* authRegisterSuccess() {
  yield put(actions.router.redirect('/dashboard'))
}

function* authLogout() {
  document.location = config.logout + '?redirect=' + config.basepath
}

function* testHook() {
  console.log('-------------------------------------------');
  console.log('test hook')
}

const Hooks = (opts = {}) => {

  const apis = opts.apis

  const auth = AuthSaga({
    apis: apis.auth,
    formTouchAll: actions.formutils.touchAll
  })

  const form = FormSagas()

  const project = ProjectSaga({
    apis: apis.project
  })

  const hooks = {
    
    // system sagas
    message: systemSagas.message,

    // auth sagas
    authLogout,
    authLoginSuccess,
    authRegisterSuccess,
    authLoginSubmit: auth.login,
    authRegisterSubmit: auth.register,
    authenticateRoute: auth.checkRoute,

    // form sagas

    formList: form.list,
    testHook,
    
    // api sagas
    projectList: project.list,
    projectAdd: project.add,
    projectEdit: project.edit,
    projectSave: project.save,
    projectTest: project.test,
  }

  function* initialize() {
    yield call(auth.status)
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