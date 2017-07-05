import tape from 'tape'

import FormActions from './actions'
import FormReducer from './reducer'


tape('FormReducer', (t) => {
  const actions = FormActions()('login')
  const reducer = FormReducer()

  const defaultState = reducer()

  t.deepEqual(defaultState, {}, 'default state')

  const initializeState = reducer(defaultState, actions.initialize({a:10}))

  t.deepEqual(initializeState, {
    login: {
      model: {a:10},
      meta: {},
      form: {}
    }
  }, 'initializeState')

  const writeMeta1 = reducer(initializeState, actions.write('meta', {a:10}))
  const writeMeta2 = reducer(writeMeta1, actions.write('meta', {b:5}))

  t.deepEqual(writeMeta1.login.meta, {a:10}, 'write meta 1')
  t.deepEqual(writeMeta2.login.meta, {a:10,b:5}, 'write meta 2')

  t.end()
})