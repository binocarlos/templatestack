import { take, put, call, fork, select, all, takeLatest, takeEvery, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import options from 'template-tools/src/utils/options'
import apiSaga from 'template-ui/lib/plugins2/api/saga'

const REQUIRED_APIS = [
  'refreshToken'
]

const TokenApiWrapper = (opts = {}) => {

  const refreshToken = opts.refreshToken

  function* tokenApi(requestOpts) {
    let ret = yield call(apiSaga, requestOpts)
    const error = ret.error
    if(error && error.code == 401 && error.message == 'Invalid Credentials') {
      yield call(refreshToken)
      ret = yield call(apiSaga, requestOpts)
    }
    return ret
  }

  return tokenApi
}

export default TokenApiWrapper
