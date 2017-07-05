import tape from 'tape'
import { expectSaga } from 'redux-saga-test-plan'
import FormActions from './actions'
import FormSaga from './saga'

const login = (data) => {
  return {
    username: {
      
    },
    password: {}
  }
}

const forms = {
  login
}

tape('form saga', (t) => {
  const NAME = 'login'
  const INITIAL_DATA = {}
  const baseActions = FormActions()
  const actions = {
    [NAME]: baseActions(NAME)
  }
  const saga = FormSaga({
    forms
  })
  const action = actions.login.initialize({})
  return expectSaga(saga)
    .dispatch(actions.login.initialize({username: 'bob'}))
    .run()
    .then((result) => {
      t.ok('saga has passed')
      t.end()
    })
})
