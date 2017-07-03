import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'

export default function configureStore(opts = {}) {
  if(!opts.reducers) throw new Error('reducers required')
  if(!opts.router) throw new Error('router required')
  const { reducers, router, initialState } = opts
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    combineReducers({
      router: router.reducer,
      ...reducers
    }),
    initialState,
    compose(
      router.enhancer,
      applyMiddleware(
        sagaMiddleware,
        router.middleware
      )
    )
  )
  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)
  return store
}