import {
  initialize
} from 'redux-form'
import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

const formInitializeSaga = (forms) => {
  function* initializeForms() {
    yield all(
      Object.keys(forms).map(name =>{
        const formConfig = forms[name]
        return put(initialize(name, formConfig.initialValues || {}))
      })
    )
  }
  return initializeForms
}

export default formInitializeSaga