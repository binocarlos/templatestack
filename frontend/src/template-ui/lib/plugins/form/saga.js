import { take, put, call, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects'

import { ID } from './actions'
import { actionInfo } from '../../utils/actions'
import { PatternHandlers } from '../../utils/saga'
import Field from './field'

const processSchema = (schema) => {
  return Object.keys(schema || {}).reduce((all, name) => {
    const opts = Object.assign({}, {
      name
    }, schema[name])
    all[name] = Field(opts)
    return all
  }, {})
}

const getDefaults = (schema) => {
  return Object.keys(schema || {}).reduce((all, name) => {
    const field = schema[name]
    all[name] = field.getDefault()
    return all
  }, {})
}

// process the raw model via defaults
const getModelData = (schema, model) => {
  return Object.assign({}, getDefaults(schema), model)
}

// process the current model via get functions
const getFormData = (schema, model) => {
  return Object.keys(schema || {}).reduce((all, name) => {
    const field = schema[name]
    all[name] = field.get(model)
    return all
  }, {})
}

const getMetaData = (schema, model = {}, allmeta = {}) => {
  return Object.keys(schema || {}).reduce((all, name) => {
    const existingMeta = allmeta[name] || {}
    const field = schema[name]
    const value = model[name]
    const error = field.validate(value, model)
    all[name] = Object.assign({}, existingMeta, {
      valid: error ? false : true,
      error,
      touched: false
    })
    return all
  }, {})
}

const FormSaga = (opts = {}) => {
  if(!opts.getSchema) throw new Error('getSchema needed for FormSaga')
  if(!opts.getActions) throw new Error('getActions needed for FormSaga')

  const id = opts.id || ID
  const forms = opts.forms

  // get the schema for the 'login' form
  const getSchema = (name, model) => {
    const rawSchema = opts.getSchema(name, model)
    if(!rawSchema) throw new Error(`no schema found: ${name}`)
    return processSchema(rawSchema(model))
  }

  // get the actions for the 'login form'
  const getActions = (name) => {
    const actions = opts.getActions(name)
    if(!actions) throw new Error(`no actions found: ${name}`)
    return actions
  }

  function* initialize(action) {
    const rawmodel = action.model
    const info = actionInfo(action)
    const schema = getSchema(info.name, rawmodel)
    const actions = getActions(info.name)

    const model = getModelData(schema, rawmodel)
    const form = getFormData(schema, model)
    const meta = getMetaData(schema, model)

    console.log('-------------------------------------------');
    console.log('-------------------------------------------');
    console.dir('writing meta')
    console.dir(meta)
    yield put(actions.set({
      model,
      form,
      meta
    }))
  }

  function* changed(action) {

    const fieldName = action.name
    const value = action.value

    const info = actionInfo(action)
    const data = yield select(state => state[id][info.name])

    console.log('-------------------------------------------');
    console.log('-------------------------------------------');
    console.dir(data)
    process.exit()
    const model = data.model || {}
    const meta = data.meta || {}

    const schema = getSchema(info.name, model)
    const actions = getActions(info.name)

    const field = schema[fieldName]
    if(!field) throw new Error(`field: ${fieldName} not found in schema: ${info.name}`)

    const modelValue = field.set(value)
    const valid = field.validate(modelValue)

    yield put(actions.write('form', {
      [fieldName]: value
    }))
    yield put(actions.write('model', {
      [fieldName]: modelValue
    }))
    yield put(actions.write('meta', {
      [fieldName]: Object.assign({}, meta, {
        touched: true,
        valid
      })
    }))
  }

  const handlers = PatternHandlers({
    id,
    handlers: {
      initialize,
      changed  
    }
  })

  return handlers
}

export default FormSaga