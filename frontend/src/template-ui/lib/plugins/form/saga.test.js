import tape from 'tape'
import { expectSaga } from 'redux-saga-test-plan'
import FormActions from './actions'
import FormSaga from './saga'





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
  const saga = FormSaga({
    forms
  })
  const action = actions.login.initialize({
    username: USERNAME
  })
  return expectSaga(saga)
    .dispatch(action)
    .run()
    .then((result) => {
      t.ok('saga has passed')
      t.end()
    })
})
