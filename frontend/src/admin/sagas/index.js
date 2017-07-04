import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import RouterSaga from 'template-ui/lib/plugins/router/saga'
import FormSaga from 'template-ui/lib/plugins/api/saga'

import Field from 'template-ui/lib/plugins/form/field'

import config from '../config'
import forms from '../forms'
import api from '../api'
import * as actions from '../actions'
import * as selectors from '../selectors'

import redirects from './redirects'
import loaders from './loaders'

function* initialize() {
  yield all([
    call(loaders.config),
    call(loaders.userStatus)
  ])
  yield put(actions.value.initialized.set(true))
}

export default function* root() {
  const handlers = [
    initialize,
    RouterSaga({
      redirects,
      loaders,
      basepath: config.basepath
    }),
    FormSaga({
      types: actions.form._types,
      forms: forms
    })
  ]
  yield all(handlers.map(fork))
}