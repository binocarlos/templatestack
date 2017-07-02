import React, { Component, PropTypes } from 'react'

import Application from './containers/Application'
import Route from './containers/Route'


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
        <div>
          hello world2
        </div>
      </Route>

      <Route path='/help'>
        <div>
          Help
        </div>
      </Route>
    </Application>
  </div>
)