import React from 'react'
import { render } from 'react-dom'
import { routerForBrowser } from 'redux-little-router'
import Root from './containers/Root'
import configureStore from './store/configureStore'
import rootSaga from './sagas'
import { routeConfig } from './routes'

const router = routerForBrowser({
  routes: routeConfig
})

const store = configureStore(router, window.__INITIAL_STATE__)
store.runSaga(rootSaga)

render(
  <Root 
    store={ store }
  />,
  document.getElementById('mount')
)
