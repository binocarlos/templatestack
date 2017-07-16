import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'
import RouterSaga from 'template-ui/lib/plugins/router/saga'
import AuthSaga from 'template-ui/lib/plugins/auth/saga'

import * as actions from '../actions'

import api from '../api'
import config from '../config'
import triggers from './triggers'
import loaders from './loaders'

const router = RouterSaga({
  triggers,
  basepath: config.basepath
})

const auth = AuthSaga({
  actions: actions.auth,
  apis: api.auth
})

function* initialize() {
  yield all([
    call(loaders.loadConfig),
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