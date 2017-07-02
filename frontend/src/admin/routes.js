import React, { Component, PropTypes } from 'react'

import Application from './containers/Application'
import Route from './containers/Route'

import Home from './components/Home'


export const routeConfig = {
  '/': {},
  '/help': {},
  '/about': {},
  '/login': {},
  '/register': {}
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