import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import { 
  getRouteInfoHooks,
  authenticateRoute
} from 'template-ui/lib/plugins2/router/tools'

import consoleTools from 'template-ui/lib/utils/console'

import AuthSaga from 'template-ui/lib/plugins2/auth/saga'
import FormSagas from 'template-ui/lib/plugins2/form/sagas'
import systemSagas from 'template-ui/lib/plugins2/system/sagas'

import config from '../config'
import actions from '../actions'
import selectors from '../selectors'
import digger from '../digger'
import crud from '../crud'

import { redirects } from '../routes'

function* authLoginSuccess() {
  yield put(actions.router.redirect('/dashboard'))
}

function* authRegisterSuccess() {
  yield put(actions.router.redirect('/dashboard'))
}

function* googleLogin() {
  document.location = config.googleLogin
}

function* authLogout() {
  document.location = config.logout + '?redirect=' + config.basepath
}

const redirectorHook = (name) => {
  const redirectFunction = redirects[name]
  function* doRedirect(payload) {
    const state = yield select(state => state)
    yield put(actions.router.redirect(redirectFunction(payload, state)))
  }

  return doRedirect
}

const Hooks = (opts = {}) => {

  const apis = opts.apis

  const installation = crud.installation.saga

  const resource = digger.resource.saga
  const bookingForm = digger.bookingForm.saga

  const auth = AuthSaga({
    apis: apis.auth,
    formTouchAll: actions.formutils.touchAll,
    hooks: {
      status: installation.loadActive
    }
  })

  const form = FormSagas()

  const user = crud.user.saga

  const hooks = {
    
    // system sagas
    message: systemSagas.message,

    // form sagas
    formList: form.list,
    formItem: form.item,
    formSearchItem: form.searchItem,

    // user sagas
    userList: user.list,
    userLoad: user.load,
    userSave: user.save,
    userEdit: redirectorHook('userEdit'),
    userCancel: redirectorHook('userCancel'),

    // installation saga
    installationList: installation.list,
    installationLoad: installation.load,
    installationSave: installation.save,
    installationDelete: installation.del,
    installationTableAction: installation.tableAction,
    installationAdd: redirectorHook('installationAdd'),
    installationEdit: redirectorHook('installationEdit'),
    installationCancel: redirectorHook('installationCancel'),

    // resource saga
    resourceDescendents: resource.descendents,
    resourceList: resource.list,
    resourceLoad: resource.load,
    resourceSave: resource.save,
    resourceDelete: resource.del,
    resourceTableAction: resource.tableAction,
    resourceView: redirectorHook('resourceView'),
    resourceAdd: redirectorHook('resourceAdd'),
    resourceEdit: redirectorHook('resourceEdit'),
    resourceCancel: redirectorHook('resourceCancel'),

    // resource saga
    bookingFormList: bookingForm.list,
    bookingFormLoad: bookingForm.load,
    bookingFormSave: bookingForm.save,
    bookingFormDelete: bookingForm.del,
    bookingFormTableAction: bookingForm.tableAction,
    bookingFormAdd: redirectorHook('bookingFormAdd'),
    bookingFormEdit: redirectorHook('bookingFormEdit'),
    bookingFormCancel: redirectorHook('bookingFormCancel'),

    // auth sagas
    authLogout,
    authLoginSuccess,
    authRegisterSuccess,
    authLoginSubmit: auth.login,
    authRegisterSubmit: auth.register,
    authUpdate: auth.update,
    authGoogleSubmit: googleLogin,
    authenticateRoute: auth.checkRoute,

  }

  function* initialize() {
    yield call(auth.status)
    const loggedIn = yield select(selectors.auth.loggedIn)
    
    // load the users current project (if specified)
    if(loggedIn) {
      //yield call(projects.list)
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