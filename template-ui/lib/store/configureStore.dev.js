import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import createSagaMiddleware, { END } from 'redux-saga'
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

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
    composeEnhancers(
      router.enhancer,
      applyMiddleware(
        sagaMiddleware,
        router.middleware,
        createLogger({
          collapsed:true
        })
      )
    )
  )
  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)
  return store
}