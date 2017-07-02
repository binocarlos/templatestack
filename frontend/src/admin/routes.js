import React, { Component, PropTypes } from 'react'
import ApplicationLayout from 'template-ui/lib/components/layout/Application'
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
      <ApplicationLayout>
        <div>
          Home page
        </div>
      </ApplicationLayout>
    </Route>

    <Route path='/help'>
      <div>
        Help
      </div>
    </Route>
  </div>
)