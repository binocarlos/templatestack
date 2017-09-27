import { take, put, call, fork, select, all, takeLatest, takeEvery, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import config from '../config'
import * as actions from '../actions'
import * as selectors from '../selectors'

const REQUIRED_APIS = [
  'load',
  'get',
  'create',
  'save',
  'del',
  'activate'
]

const InstallationSagas = (opts = {}) => {
  if(!opts.apis) throw new Error('installation saga requires a api option')
  const apis = opts.apis
  REQUIRED_APIS.forEach(name => {
    if(!apis[name]) throw new Error(`${name} api required`)
  })

  function* setData(payload) {
    let repos = payload.Volumes || []
    let servers = payload.Servers || []
    repos = listUtils.sortObjectList(repos, selectors.repo.name)
    yield put(actions.value.set('reposLoaded', true))
    yield put(actions.value.set('repos', repos))
    yield put(actions.value.set('servers', servers))
  }

  // called if there is an error so the user is not looking at stale data
  function* resetData() {
    yield put(actions.value.set('repos', []))
    yield put(actions.value.set('servers', []))
  }

  function* setCommitData(payload) {
    let commits = payload || []
    commits = listUtils.sortObjectList(commits, selectors.commit.timestamp, true)
    yield put(actions.value.set('commits', commits))
  }

  function* resetCommitData() {
    yield put(actions.value.set('commits', []))
  }

  // load the current volume list
  function* list() {    
    const { answer, error } = yield call(apis.list.loader)

    if(error) {
      yield call(resetData)
    }
    else {
      yield call(setData, answer)
    }
  }

  function* loadCommits(id) {
    const { answer, error } = yield call(apis.loadCommits.loader, id)

    if(error) {
      yield put(actions.application.setMessage(error.toString()))
      yield call(resetData)
    }
    else {
      yield call(setCommitData, answer)
    }
  }

  // make sure we are on page one as soon as they change the search
  function* updateSearch(search) {
    const currentPage = yield select(selectors.repos.pageCurrent)
    if(currentPage>1) {
      yield put(actions.router.redirect('/repos/page/1'))
    }
    yield put(actions.repos.updateSearch(search))
  }

  function* updatePage(page) {
    yield put(actions.router.redirect(`/repos/page/${page}`))
  }

  // make sure we are on page one as soon as they change the search
  function* commitUpdateSearch(search) {
    const pageInfo = yield select(selectors.repoPage.urlInfo)
    if(pageInfo.Page>1) {
      yield put(actions.router.redirect(`/${pageInfo.Namespace}/${pageInfo.Name}/tree/${pageInfo.Branch}/page/1`))
    }
    yield put(actions.commits.updateSearch(search))
  }

  function* commitUpdatePage(page) {
    const pageInfo = yield select(selectors.repoPage.urlInfo)
    yield put(actions.router.redirect(`/${pageInfo.Namespace}/${pageInfo.Name}/tree/${pageInfo.Branch}/page/${page}`))
  }

  function* formInitialize() {
    yield put(actions.forms.reset('repo'))
  }

  function* formSubmit() {
    const isValid = yield select(state => selectors.form.repo.valid(state))
    const values = yield select(state => selectors.form.repo.values(state))

    if(!isValid) return

    yield put(actions.value.set('repoFormLoading', true))
    const Name = values.Name
    const Namespace = yield select(selectors.auth.name)

    const payload = {
      Namespace,
      Name
    }

    // load the repos so we can see if the one they are adding exists already
    yield call(list)

    const exists = yield select(state => selectors.repos.exists(state, payload))

    if(exists) {
      yield put(actions.value.set('repoFormLoading', false))
      yield put(actions.application.setMessage(`repo with name: ${Namespace} / ${Name} already exists`))
      return
    }

    const { answer, error } = yield call(apis.create.loader, payload)
    
    if(error) {
      yield put(actions.value.set('repoFormLoading', false))
      yield put(actions.application.setMessage(error.toString()))
      return
    }

    yield put(actions.value.set('repoFormLoading', false))
    yield put(actions.application.setMessage(`repo ${Namespace} / ${Name} created`))
    yield put(actions.router.redirect('/repos'))
  }

  function* addCollaborator() {

    yield put(actions.value.set('collaboratorFormLoading', true))

    const addName = yield select(state => selectors.value(state, 'addCollaboratorName'))

    if(!addName || addName.length <= 0) {
      yield put(actions.application.setMessage(`please enter a collaborator name`))
      yield put(actions.value.set('collaboratorFormLoading', false))
      return
    }

    const info = yield select(state => selectors.repoPage.urlInfo(state))
    const repo = yield select(state => selectors.repos.getRepo(state, info))
    const collaborators = yield select(state => selectors.repo.collaborators(repo))

    const existing = collaborators.filter(collaborator => selectors.user.name(collaborator) == addName)[0]

    if(existing) {
      yield put(actions.application.setMessage(`collaborator with name: ${addName} already exists`))
      yield put(actions.value.set('collaboratorFormLoading', false))
      return
    }

    const payload = {
      Volume: selectors.repo.id(repo),
      Collaborator: addName
    }

    const { answer, error } = yield call(apis.addCollaborator.loader, payload)
    
    if(error) {
      yield put(actions.value.set('collaboratorFormLoading', false))
      yield put(actions.application.setMessage(error.toString()))
      return
    }

    yield put(actions.value.set('collaboratorFormLoading', false))
    yield put(actions.application.setMessage(`collaborator ${addName} added`))
    yield put(actions.value.set('addCollaboratorName', ''))
    yield call(loadPageData)
  }

  function* open(repo) {
    const namespace = selectors.repo.namespace(repo)
    const name = selectors.repo.name(repo)

    yield put(actions.router.redirect(`/${namespace}/${name}`))
    yield call(list)
  }

  function* openTab(section) {
    const url = yield select(selectors.repoPage.url)
    const tabUrl = `/${url}${section ? '/' + section : ''}`
    yield put(actions.router.redirect(tabUrl))
  }

  function* openBranch(branchname) {
    const info = yield select(selectors.repoPage.urlInfo)
    const branchUrl = `/${info.Namespace}/${info.Name}/tree/${branchname}`
    yield put(actions.router.redirect(branchUrl))
  }

  function* openSettingsPage(page) {
    const url = yield select(selectors.repoPage.url)
    const pageUrl = `/${url}/settings${page ? '/' + page : ''}`
    yield put(actions.router.redirect(pageUrl))
  }

  function* loadPageData() {
    //yield put(actions.value.set('repoPageDataLoaded', false))
    yield call(list)
    const info = yield select(selectors.repoPage.urlInfo)
    const repo = yield select(state => selectors.repos.getRepo(state, info))
    const branch = yield select(state => selectors.repo.getBranch(repo, info.Branch))
    yield call(loadCommits, branch.Id)
    yield put(actions.value.set('repoPageDataLoaded', true))
  }

  return {
    list,
    updateSearch,
    updatePage,
    commitUpdateSearch,
    commitUpdatePage,
    formInitialize,
    formSubmit,
    open,
    openTab,
    openBranch,
    openSettingsPage,
    loadPageData,
    addCollaborator
  }
}

export default RepoSagas
