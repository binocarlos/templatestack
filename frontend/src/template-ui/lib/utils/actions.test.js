import tape from 'tape'
import { ActionFactory } from './actions'

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
    type_fruit: 'FRUIT_APPLES'
  }, 'apples A action is correct')

  t.deepEqual(actionsB.oranges(20), {
    height: 20,
    type: 'FRUIT_B_ORANGES',
    type_fruit: 'FRUIT_ORANGES'
  }, 'oranges B action is correct')

  t.end()
})