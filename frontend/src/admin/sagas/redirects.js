import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

function* logout() {
  document.location = '/api/v1/logout'
}

const redirects = {
  logout
}

export default redirects