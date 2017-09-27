import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import InitializeFormSaga from 'template-ui/lib/plugins/form/initializeSaga'
import RouterSaga from 'template-ui/lib/plugins/router/saga'
import AuthSaga from 'template-ui/lib/plugins/auth/saga'

import * as actions from '../actions'

import apis from '../api'
import authApi from '../api/auth'
import config from '../config'
import forms from '../forms'

import Installation from './installation'
import Hooks from './hooks'

const auth = AuthSaga({
  actions: actions.auth,
  apis: authApi,
  basepath: config.basepath,
  messageHook: 'systemMessage',
  touchAllAction: actions.form.touchAll
})

const installation = Installation({
  apis: {
    list: apis.installationList,
    get: apis.installationGet,
    create: apis.installationCreate,
    save: apis.installationSave,
    del: apis.installationDel,
    activate: apis.installationActivate
  }
})

const hooks = Hooks({
  auth,
  installation
})

const router = RouterSaga({
  hooks,
  basepath: config.basepath
})

function* initialize() {
  yield call(delay, 1)
  yield all([
    call(auth.status),
    call(InitializeFormSaga(forms))
  ])
  yield put(actions.value.set('initialized', true))
  yield call(router.initialize)
}

export default function* root() {
  yield all([
    initialize,
    router.main
  ].map(fork))
}