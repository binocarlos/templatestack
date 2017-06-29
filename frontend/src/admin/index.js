import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { fork, put, take, select, call } from 'redux-saga/effects'
import { Button } from 'react-toolbox/lib/button'
import Widget from './widget'


function* loadConfig() {
  yield put(actions.getConfig.request())
}

ReactDOM.render(
  (
    <div>
      <Button label="Hello World!" />
      <Widget />
    </div>
  ),
  document.getElementById('mount')
)