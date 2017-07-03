import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import createSagaMiddleware, { END } from 'redux-saga'
import rootReducers from '../reducers'

export default function configureStore(router, initialState) {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    combineReducers({
      router: router.reducer,
      ...rootReducers
    }),
    initialState,
    compose(
      router.enhancer,
      applyMiddleware(
        sagaMiddleware,
        router.middleware,
        createLogger({
          collapsed:true
        })
      ),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )
  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)
  return store
}