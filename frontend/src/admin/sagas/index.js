import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'
import RouterSaga from 'template-ui/lib/plugins/router/saga'
import AuthSaga from 'template-ui/lib/plugins/auth/saga'

import * as actions from '../actions'

import api from '../api'
import config from '../config'
import Triggers from './triggers'
import loaders from './loaders'

const auth = AuthSaga({
  actions: actions.auth,
  apis: api.auth,
  basepath: config.basepath
})

const triggers = Triggers({
  auth
})

const router = RouterSaga({
  triggers,
  basepath: config.basepath
})

function* initialize() {
  yield all([
    call(loaders.config),
    call(auth.status)
  ])
  yield put(actions.value.set('initialized', true))
}

export default function* root() {
  yield all([
    initialize,
    router
  ].map(fork))
}