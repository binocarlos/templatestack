import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import { ForkListeners } from '../../utils/saga'
import actions, { TYPES } from './actions'

const RouterSaga = (opts = {}) => {
  if(!opts.redirects) throw new Error('redirects needed for RouterSaga')
  if(!opts.loaders) throw new Error('loaders needed for RouterSaga')

  const { redirects, loaders } = opts

  function* redirect(action) {
    if(!action.name) return
    if(action.name.indexOf('/') == 0) {
      yield put(actions.push(action.name))
    }
    else {
      const redirectHandler = redirects[action.name]
      if(!redirectHandler) return
      yield call(redirectHandler, action.payload)
    }
  }

  function* changed(action) {
    console.log('-------------------------------------------');
    console.dir('changed')
    console.dir(action)
  }

  return ForkListeners([
    [TYPES.redirect, redirect],
    [TYPES.changed, changed]
  ])
}

export default RouterSaga