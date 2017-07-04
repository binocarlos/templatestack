import update from 'immutability-helper'
import tape from 'tape'
import {
  ActionFactory,
  TypeFactory
} from './actions'
import {
  ReducerFactory
} from './reducer'

tape('ReducerFactory (basic)', (t) => {

  const INITIAL_STATE = {
    size: 0,
    height: 0,
    color: ''
  }

  const ID = 'fruit'
  const ACTIONS = {
    apples: (size, color) => ({ size, color}),
    oranges: (height) => ({ height })
  }

  const HANDLERS = {
    apples: (state, action) => update(state, {
      size: {
        $set: action.size
      },
      color: {
        $set: action.color
      }
    }),
    oranges: (state, action) => update(state, {
      height: {
        $set: action.height
      }
    })
  }

  const FruitActions = ActionFactory(ID, ACTIONS)
  const FruitTypes = TypeFactory(ID, ACTIONS)
  const FruitReducer = ReducerFactory({
    id: ID,
    handlers: HANDLERS,
    types: FruitTypes,
    initialState: INITIAL_STATE
  })
  const actionsA = FruitActions('A')

  const defaultState = FruitReducer()

  t.deepEqual(defaultState, INITIAL_STATE, 'defaultState = INITIAL_STATE')
  t.deepEqual(FruitReducer(defaultState, actionsA.oranges(15)), Object.assign({}, INITIAL_STATE, {
    height: 15
  }), 'oranges action')
  t.deepEqual(FruitReducer(defaultState, actionsA.apples(20, 'yellow')), Object.assign({}, INITIAL_STATE, {
    size: 20,
    color: 'yellow'
  }), 'apples action')

  t.end()
})