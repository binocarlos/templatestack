import React, { Component, PropTypes } from 'react'

import RouteFactory from 'template-ui/lib/containers/Route'

import config from './config'

import Application from './containers/Application'
import Home from './components/Home'

const Route = RouteFactory(config.basepath)

export const routeConfig = {
  '/': {},
  '/help': {},
  '/about': {},
  '/login': {},
  '/register': {}
}

export const redirectHandlers = {
  'logout': () => document.location = '/api/v1/logout'
}

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