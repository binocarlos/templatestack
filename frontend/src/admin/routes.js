import React, { Component, PropTypes } from 'react'
import Route from './containers/Route'

export const routeConfig = {
  '/': {},
  '/help': {},
  '/about': {},
  '/login': {},
  '/register': {}
}

export const routes = (
  <div id='routeWrapper'>
    <Route home>
      <div>
        Home page
      </div>
    </Route>

    <Route path='/help'>
      <div>
        Help
      </div>
    </Route>
  </div>
)