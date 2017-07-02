import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import { routerForBrowser } from 'redux-little-router'
import { routeConfig } from '../routes'
import rootReducers from '../reducers'

export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware()
  const littleRouter = routerForBrowser({
    routes: routeConfig
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
        sagaMiddleware
      )
    )
  )

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