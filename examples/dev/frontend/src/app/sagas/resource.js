import { take, put, call, fork, select, all, takeLatest, takeEvery, cancel } from 'redux-saga/effects'
import selectors from '../selectors'
import actions from '../actions'
import digger from '../digger'

import DiggerSaga from 'template-ui/lib/plugins2/digger/saga'

const ResourceSagaFactory = (opts = {}) => {

  function* loadInitialData(payload) {
    return digger.getInitialData(payload.type)
  }

  function* handleTableAction(payload) {
    if(payload.name == 'open') {
      yield put(actions.router.hook('resourceView', payload.item.id))
    }
    else if(payload.name == 'up') {
      const currentItem = yield select(state => selectors.resource.tree.selectedItem(state))
      yield put(actions.router.hook('resourceView', currentItem.parent))
    }
  }

  const resourceSaga = DiggerSaga({
    name: 'resource',
    actions: actions.resource,
    selectors: selectors.resource,
    apis: opts.apis,
    descendentType: 'folder',
    loadInitialData,
    tableAction: handleTableAction,
    processTreeData: (data) => {
      const rootItem = {
        name: 'Resources',
        type: 'root',
        children: data
      }
      return [rootItem]
    },

  })

  return resourceSaga
}

export default ResourceSagaFactory