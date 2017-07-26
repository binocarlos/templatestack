import update from 'immutability-helper'
import tape from 'tape'
import ActionFactory from './actions'
import ReducerFactory from './reducer'

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
    oranges: (state, action) => {
      return update(state, {
        height: {
          $set: action.height
        }
      })
    }
  }

  const FruitActions = ActionFactory(ID, ACTIONS)
  const FruitReducer = ReducerFactory({
    id: ID,
    handlers: HANDLERS,
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

tape('ReducerFactory (namespaces)', (t) => {

  const INITIAL_STATE = {
    
  }

  const ID = 'value'
  const NAME_FIELD = `name_${ID}`
  const ACTIONS = {
    set: null
  }

  const HANDLERS = {
    set: (state, action, id) => update(state, {
      [id]: {
        $set: action.payload
      }
    })
  }

  const ValueActions = ActionFactory(ID, ACTIONS)  
  const ValueReducer = ReducerFactory({
    id: ID,
    handlers: HANDLERS,
    initialState: INITIAL_STATE
  })

  const size = ValueActions('size')
  const color = ValueActions('color')

  const defaultState = ValueReducer()

  t.deepEqual(defaultState, INITIAL_STATE, 'defaultState = INITIAL_STATE')
  
  t.deepEqual(ValueReducer(defaultState, size.set(10)), {size:10}, 'size set from default')
  t.deepEqual(ValueReducer({size:5}, color.set('red')), {size:5,color:'red'}, 'color set from previous')

  t.end()
})
