import tape from 'tape'

import ValueActions from './actions'
import ValueReducer from './reducer'

tape('value reducer: default', (t) => {
  const actions = ValueActions()('fruit')
  const reducer = ValueReducer()
  t.deepEqual(reducer(), {}, 'default state')
  t.end()
})

tape('value reducer: set', (t) => {
  const actions = ValueActions()('fruit')
  const reducer = ValueReducer()
  t.deepEqual(reducer({}, actions.set(10)), {fruit:10}, 'fruit is set')
  t.end()
})

tape('value reducer: toggle', (t) => {
  const actions = ValueActions()('fruit')
  const reducer = ValueReducer()
  t.deepEqual(reducer({fruit:true}, actions.toggle()), {fruit:false}, 'true -> false')
  t.deepEqual(reducer({fruit:false}, actions.toggle()), {fruit:true}, 'false -> true')
  t.deepEqual(reducer({}, actions.toggle()), {fruit:true}, 'undefined -> true')
  t.end()
})
