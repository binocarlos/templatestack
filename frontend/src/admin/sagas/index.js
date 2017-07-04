import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import RouterSaga from 'template-ui/lib/plugins/router/saga'
import FormSaga from 'template-ui/lib/plugins/api/saga'

import config from '../config'
import api from '../api'
import * as actions from '../actions'
import * as selectors from '../selectors'

import redirects from './redirects'
import loaders from './loaders'

import { getRoute } from '../routes'

function* initialize() {
  yield all([
    call(loaders.config),
    call(loaders.userStatus)
  ])
  yield put(actions.value.initialized.set(true))
}

export default function* root() {
  yield all([
    fork(initialize),
    fork(RouterSaga({
      redirects,
      loaders,
      basepath: config.basepath
    })),
    fork(FormSaga({
      types: actions.form._types,
      getSchema: (name, data) => {
        return {}
      }
    }))
  ])
}