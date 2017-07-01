import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import createSagaMiddleware, { END } from 'redux-saga'
import { routerForBrowser } from 'redux-little-router'
import DevTools from '../containers/DevTools'
import routes from '../routes'
import rootReducers from '../reducers'

export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware()
  const littleRouter = routerForBrowser({
    routes
  })
  const store = createStore(
    combineReducers({
      router: littleRouter.reducer,
      ...rootReducers
    }),
    initialState,
    compose(
      littleRouter.enhancer,
      applyMiddleware(
        sagaMiddleware,
        createLogger({
          collapsed:true
        })
      ),
      DevTools.instrument(),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  /*
  
    
  const initialLocation = store.getState().router
  if (initialLocation) {
    store.dispatch(initializeCurrentLocation(initialLocation))  
  }
    
  */
  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)
  return store
}