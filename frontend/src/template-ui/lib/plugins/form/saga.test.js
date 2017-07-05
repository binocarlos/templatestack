import tape from 'tape'
import { expectSaga } from 'redux-saga-test-plan'
import FormActions from './actions'
import FormSaga from './saga'

const getSaga = (opts = {}) => {
  const forms = opts.forms
  const actions = opts.actions
  const getSchema = (name, model) => forms[name]
  const getActions = (name) => actions[name]
  return FormSaga({
    getSchema,
    getActions
  })
}


tape('form saga: initialize', (t) => {
  const NAME = 'login'
  const USERNAME = 'bob'
  const DEFAULT_PASSWORD = 'default_password'
  const INITIAL_DATA = {
    username: 'bob'
  }
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
  const saga = getSaga({
    actions,
    forms
  })
  const action = actions.login.initialize({
    username: USERNAME
  })

  const CHECK_META = { valid: true, error: null, touched: false, focused: false }
  const CHECK_MODEL = { username: 'bob', password: 'default_password' }
  return expectSaga(saga)
    .put({ 
      values: { 
        model: CHECK_MODEL,
        form: CHECK_MODEL,
        meta: { 
          username: CHECK_META,
          password: CHECK_META
        }
      },
      type: 'FORM_SET_LOGIN',
      _generictype: 'FORM_SET',
      _genericid: 'form',
      _genericname: 'login',
      _genericaction: 'set'
    })
    .dispatch(action)
    .run()
    .then((result) => {
      t.ok('saga has passed')
      t.end()
    })
})
