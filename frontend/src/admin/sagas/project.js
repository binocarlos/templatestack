import { take, put, call, fork, select, all, takeLatest, takeEvery, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import options from 'template-tools/src/utils/options'

import apiSaga from 'template-ui/lib/plugins2/api/saga'

import config from '../config'
import actions from '../actions'
import selectors from '../selectors'

const REQUIRED_APIS = [
  'list',
  'get',
  'create',
  'save',
  'del',
  'activate'
]

const ProjectSagas = (opts = {}) => {
  if(!opts.apis) throw new Error('project saga requires a apis option')

  const apis = options.processor(opts.apis, {
    required: REQUIRED_APIS
  })

  function* list() {
    const { answer, error } = yield call(apiSaga, {
      name: 'projectList',
      handler: apis.list
    })
    if(error) {
      yield put(actions.system.message(error))
      yield put(actions.project.list.setData([]))
    }
    else {
      yield put(actions.project.list.setData(answer))
    }
  }

  return {
    list
  }
}

export default ProjectSagas
