import tape from 'tape'
import { expectSaga } from 'redux-saga-test-plan'
import { combineReducers } from 'redux'
import FormActions, { ID } from './actions'
import FormReducer from './reducer'
import FormSaga from './saga'

const NAME = 'login'
const USERNAME = 'bob'
const DEFAULT_PASSWORD = 'default_password'
const INITIAL_DATA = {
  username: 'bob'
}

const CHECK_META = { valid: true, error: null, touched: false }
const CHECK_MODEL = { username: 'bob', password: 'default_password' }

const getAction = (action, opts) => {
  return Object.assign({}, opts, {
    type: `FORM_${action.toUpperCase()}_${NAME.toUpperCase()}`,
    _generictype: `FORM_${action.toUpperCase()}`,
    _genericid: 'form',
    _genericname: NAME,
    _genericaction: action
  })
}

const CHECK_INITIALIZE_VALUES = {
  model: CHECK_MODEL,
  form: CHECK_MODEL,
  meta: { 
    username: CHECK_META,
    password: CHECK_META
  }
}

const getReducer = () => {
  return combineReducers({
    [ID]: FormReducer()
  })
}

const getSaga = (t) => {

  const baseActions = FormActions()
  const actions = {
    [NAME]: baseActions(NAME)
  }
  const login = (model) => {
    t.deepEqual(model, {username: USERNAME})
    return {
      username: {},
      password: {
        getDefault: () => DEFAULT_PASSWORD
      }
    }
  }
  const forms = {
    login
  }
  
  const getSchema = (name, model) => forms[name]
  const getActions = (name) => actions[name]
  const saga = FormSaga({
    getSchema,
    getActions
  })

  return {
    saga,
    actions
  }
}

tape('form saga: initialize', (t) => {

  const { saga, actions } = getSaga(t)
  
  return expectSaga(saga)
    .withReducer(getReducer())
    .put(getAction('set', {
      values: CHECK_INITIALIZE_VALUES
    }))
    .dispatch(actions.login.initialize({
      username: USERNAME
    }))
    .run()
    .then((result) => {
      t.ok('saga has passed')
      t.end()
    })
})

tape('form saga: changed', (t) => {
  const { saga, actions } = getSaga(t)

  const FIELDNAME = 'username'
  const NEW_VALUE = 'harry'

  const CHECK_UPDATE_FORM = {
    [FIELDNAME]: NEW_VALUE
  }
  
  return expectSaga(saga)
    .withReducer(getReducer())
    .dispatch(actions.login.initialize({
      username: USERNAME
    }))
    .dispatch(actions.login.changed(FIELDNAME, NEW_VALUE))
    .run()
    .then((result) => {
      t.ok('saga has passed')

      const actions = result.effects.put.map(a => a.PUT.action)
      const checkActions = [
        getAction('set', {
          values: CHECK_INITIALIZE_VALUES
        }),
        getAction('write', {
          section: 'form',
          values: CHECK_UPDATE_FORM
        }),
        getAction('write', {
          section: 'model',
          values: CHECK_UPDATE_FORM
        }),
        getAction('write', {
          section: 'meta',
          values: CHECK_UPDATE_FORM
        }),
      ]

      console.log(JSON.stringify(actions, null, 4))
      console.log(JSON.stringify(checkActions, null, 4))

      t.deepEqual(actions, checkActions, 'actions emitted are correct')

      console.dir()
      t.end()
    })
})
