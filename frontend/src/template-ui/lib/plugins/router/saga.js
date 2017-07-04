import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import { TYPES } from './actions'

const RouterSaga = (opts = {}) => {
  if(!opts.redirects) throw new Error('redirects needed for RouterSaga')
  const { redirects } = opts

  function* redirect() {

  }

  function* listenRedirect() {
    yield takeLatest(TYPES.redirect, redirect)
  }

  return function* routerSaga() {
    yield all([
      fork(listenRedirect)
    ])
  }

  console.log('-------------------------------------------');
  console.dir(redirects)


}

export default RouterSaga