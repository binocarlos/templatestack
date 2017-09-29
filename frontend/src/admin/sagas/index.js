import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import RouterSaga from 'template-ui/lib/plugins2/router/saga'

import apis from '../api'
import actions from '../actions'

import config from '../config'
import Hooks from './hooks'

const getRoute = (path) => config.basepath + path

const hooks = Hooks({
  apis
})

const router = RouterSaga({
  getHook: hooks.getHook,
  getRouteHooks: hooks.getRouteHooks,
  getRoute
})

function* initialize() {
  yield call(delay, 1)
  yield call(hooks.initialize)
  yield fork(router.initialize)
  yield put(actions.system.initialized())
}

export default function* root() {
  yield fork(initialize)
}