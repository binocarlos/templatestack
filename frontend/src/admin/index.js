import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { fork, put, take, select, call } from 'redux-saga/effects'
import { Button } from 'react-toolbox/lib/button'

import Test from './test'

function* loadConfig() {
  yield put(actions.getConfig.request())
}

ReactDOM.render(
  (
    <div>
      <Button label="Hello World!" />
    </div>
  ),
  document.getElementById('mount')
)