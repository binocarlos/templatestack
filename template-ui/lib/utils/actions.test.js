import tape from 'tape'
import {
  ActionFactory,
  BaseAction
} from './actions'

tape('BaseAction', (t) => {
  t.deepEqual(BaseAction('apples', 'A', 'set'), {
    type: 'APPLES_SET_A',
    _generictype: 'APPLES_SET',
    _genericid: 'apples',
    _genericname: 'A',
    _genericaction: 'set'
  }, 'base action is correct')
  t.end()
})

tape('ActionFactory', (t) => {
  const ACTIONS = {
    apples: (size, color) => ({ size, color}),
    oranges: (height) => ({ height })
  }
  const FruitActions = ActionFactory('fruit', ACTIONS)
  const actionsA = FruitActions('A')
  const actionsB = FruitActions('B')

  Object.keys(ACTIONS).forEach(name => {
    t.equal(typeof(actionsA[name]), 'function', `${name} is function`)
  })

  t.deepEqual(actionsA.apples(10, 'red'), {
    size: 10,
    color: 'red',
    type: 'FRUIT_APPLES_A',
    _genericid: 'fruit',
    _genericname: 'A',
    _genericaction: 'apples',
    _generictype: 'FRUIT_APPLES'
  }, 'apples A action is correct')

  t.deepEqual(actionsB.oranges(20), {
    height: 20,
    type: 'FRUIT_ORANGES_B',
    _genericid: 'fruit',
    _genericname: 'B',
    _genericaction: 'oranges',
    _generictype: 'FRUIT_ORANGES'
  }, 'oranges B action is correct')

  t.end()
})

tape('ActionFactory -> inject', (t) => {
  const ACTIONS = {
    set: null
  }
  const SimpleActions = ActionFactory('simple', ACTIONS)
  const testA = SimpleActions('A', {extra:10})
  
  const action = testA.set(5)

  t.equal(action.payload, 5, 'payload is 5')
  t.equal(action.extra, 10, 'extra is 10')
  
  t.end()
})

tape('ActionFactory -> types', (t) => {
  const ACTIONS = {
    set: null
  }
  const SimpleActions = ActionFactory('simple', ACTIONS)
  const testA = SimpleActions('A', {extra:10})
  
  t.deepEqual(testA._types, {
    set: 'SIMPLE_SET_A'
  }, 'types are correct')
  
  t.end()
})

tape('ActionFactory -> generic types', (t) => {
  const ACTIONS = {
    set: null
  }
  const SimpleActions = ActionFactory('simple', ACTIONS)
  
  t.deepEqual(SimpleActions._genericTypes, {
    set: 'SIMPLE_SET'
  }, 'generic types are correct')
  
  t.end()
})

tape('ActionFactory -> base types', (t) => {
  const ACTIONS = {
    set: null
  }
  const SimpleActions = ActionFactory('simple', ACTIONS)
  const baseActions = SimpleActions()
  
  t.deepEqual(baseActions._types, {
    set: 'SIMPLE_SET'
  }, 'generic types are correct')
  
  t.end()
})