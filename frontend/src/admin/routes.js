import React, { Component, PropTypes } from 'react'

import RouteFactory from 'template-ui/lib/containers/Route'
import { processRoutes } from 'template-ui/lib/utils/routes'
import config from './config'

import Application from './containers/Application'
import Home from './components/Home'

const Route = RouteFactory(config.basepath)

export const routeConfig = processRoutes({
  '/': {},
  '/help': {
    loader: 'example',
    payload: 'help'
  },
  '/about': {
    loader: 'example',
    payload: 'about'
  },
  '/login': {
    loader: 'example',
    payload: 'login'
  },
  '/register': {
    loader: 'example',
    payload: 'register'
  }
}, config.basepath)

export const routes = (
  <div>
    <Application>
      <Route home>
        <Home />
      </Route>

      <Route path='/help'>
        <div>
          Help
        </div>
      </Route>
    </Application>
  </div>
)