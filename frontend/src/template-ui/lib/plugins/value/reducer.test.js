import tape from 'tape'

import ValueActions from './actions'
import ValueReducer from './reducer'

tape('value reducer: default', (t) => {
  const actions = ValueActions('fruit')
  t.deepEqual(ValueReducer(), {}, 'default state')
  t.end()
})

tape('value reducer: set', (t) => {
  const actions = ValueActions('fruit')
  t.deepEqual(ValueReducer({}, actions.set(10)), {fruit:10}, 'fruit is set')
  t.end()
})

tape('value reducer: toggle', (t) => {
  const actions = ValueActions('fruit')
  t.deepEqual(ValueReducer({fruit:true}, actions.toggle()), {fruit:false}, 'true -> false')
  t.deepEqual(ValueReducer({fruit:false}, actions.toggle()), {fruit:true}, 'false -> true')
  t.deepEqual(ValueReducer({}, actions.toggle()), {fruit:true}, 'undefined -> true')
  t.end()
})
