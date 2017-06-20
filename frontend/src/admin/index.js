import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { fork, put, take, select, call } from 'redux-saga/effects'
import x from 'template-ui/lib/test'

function* loadConfig() {
  yield put(actions.getConfig.request())
}

ReactDOM.render(
  render(
    <div>hello world</div>
  ),
  document.getElementById('mount')
)