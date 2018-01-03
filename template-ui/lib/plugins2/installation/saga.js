import { take, put, call, fork, select, all, takeLatest, takeEvery, cancel } from 'redux-saga/effects'

import authSelectors from '../auth/selectors'
import routerActions from '../router/actions'
import valueActions from '../value/actions'
import systemActions from '../system/actions'

import apiSaga from '../api/saga'
import CrudSaga from '../crud/saga'

const InstallationSaga = (opts = {}) => {

  const { selectors, actions } = opts

  function* loadInitialData() {
    const user = yield select(state => authSelectors.user(state))

    const collaborator = Object.assign({}, user, {
      collaboration_permission: 'owner'
    })
    return {
      collaborators: [collaborator]
    }
  }

  function* tableAction(payload) {
    if(payload.name == 'open') {
      const item = payload.item
      const id = item.id
      yield put(routerActions.hook('authUpdate', {
        activeInstallationId: id
      }))
    }
  }

  function* loadActive() {
    const id = yield select(state => authSelectors.activeInstallationId(state))
    const { answer, error } = yield call(apiSaga, {
      name: `installationActiveLoad`,
      handler: opts.apis.get,
      payload: {id}
    })
    if(error) {
      yield put(systemActions.message(error))
      return
    }
    yield put(valueActions.set('activeInstallation', answer))
  }

  const installationSaga = CrudSaga({
    name: 'installation',
    actions: opts.actions,
    selectors: opts.selectors,
    apis: opts.apis,
    loadInitialData,
    tableAction,
  })

  installationSaga.loadActive = loadActive

  return installationSaga
}

export default InstallationSaga