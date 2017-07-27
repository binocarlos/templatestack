import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import ApiActions from './actions'
import apiSaga from './saga'

const apiBase = ApiActions()

// map an object of promise based api handlers
// onto the following objects:
//
//  * name
//  * loader - generator function that wraps apisaga
//  * handler - raw promise api function
//  * actions - the api actions
//
const processLoaders = (loaders) => {
  const loaderActions = Object
    .keys(loaders)
    .reduce((all, name) => {
      all[name] = apiBase(name)
      return all
    }, {})

  const apis = Object
    .keys(loaders)
    .reduce((all, name) => {
      const handler = loaders[name]
      const actions = loaderActions[name]
      function* loader(payload) {
        const ret = yield call(apiSaga, {
          name,
          actions,
          api: handler,
          payload
        })
        return ret
      }
      all[name] = {
        name,
        loader,
        handler,
        actions
      }
      return all
    }, {})

  return {
    actions: loaderActions,
    apis
  }
}


export default processLoaders