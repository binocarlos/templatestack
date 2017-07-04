import tape from 'tape'
import {
  ActionFactory,
  TypeFactory,
  BaseAction
} from './actions'

tape('BaseAction', (t) => {
  t.deepEqual(BaseAction('apples', 'A', 'set'), {
    type: 'APPLES_A_SET',
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
    type: 'FRUIT_A_APPLES',
    _genericid: 'fruit',
    _genericname: 'A',
    _genericaction: 'apples'
  }, 'apples A action is correct')

  t.deepEqual(actionsB.oranges(20), {
    height: 20,
    type: 'FRUIT_B_ORANGES',
    _genericid: 'fruit',
    _genericname: 'B',
    _genericaction: 'oranges'
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
    set: 'SIMPLE_A_SET'
  }, 'types are correct')
  
  t.end()
})

tape('TypeFactory', (t) => {
  const ACTIONS = {
    apples: (size, color) => ({ size, color}),
    oranges: (height) => ({ height })
  }

  const types = TypeFactory('fruit', ACTIONS)
  
  t.deepEqual(types, {
    apples: 'FRUIT_APPLES',
    oranges: 'FRUIT_ORANGES'
  }, 'types equal')

  t.end()
})