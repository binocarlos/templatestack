import { take, put, call, fork, select, all, takeLatest, takeEvery, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import options from 'template-tools/src/utils/options'

import apiSaga from 'template-ui/lib/plugins2/api/saga'
import formUtils from 'template-ui/lib/plugins2/form/utils'

import forms from '../forms'
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

  function* add() {
    const defaults = formUtils.getDefaults(forms.project)
    yield put(actions.form.initialize('project', defaults))
  }

  function* edit() {
    const id = yield select(state => selectors.router.param(state, 'id'))

    console.log('-------------------------------------------');
    console.log('-------------------------------------------');
    console.dir(id)
  }

  function* save() {
    const valid = yield select(state => selectors.form.valid(state, 'project'))

    if(!valid) {
      yield put(actions.form.touchAll('project', forms.project))
      return
    }

    const values = yield select(state => selectors.form.values(state, 'project'))

    console.log(JSON.stringify(values, null, 4))
    
  }

  function* test(payload) {
    console.log('-------------------------------------------');
    console.log('-------------------------------------------');
    console.log('test project hook')
    console.dir(payload)
  }

  return {
    list,
    add,
    edit,
    save,
    test
  }
}

export default ProjectSagas
