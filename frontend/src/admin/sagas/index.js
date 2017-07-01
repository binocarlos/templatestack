import { take, put, call, fork, select, all } from 'redux-saga/effects'
import { api, history } from '../services'
import * as actions from '../actions'
import { getUser, getRepo, getStarredByUser, getStargazersByRepo } from '../reducers/selectors'

// each entity defines 3 creators { request, success, failure }
const { user, repo, starred, stargazers } = actions

// url for first page
// urls for next pages will be extracted from the successive loadMore* requests
const firstPageStarredUrl = login => `users/${login}/starred`
const firstPageStargazersUrl = fullName => `repos/${fullName}/stargazers`


export default function* root() {
  yield all([
    fork(watchNavigate),
    fork(watchLoadUserPage),
    fork(watchLoadRepoPage),
    fork(watchLoadMoreStarred),
    fork(watchLoadMoreStargazers)
  ])
}
