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
        <section style={{ margin: '1.8rem'}}>
          hello world2
        </section>
      </Route>

      <Route path='/help'>
        <div>
          Help
        </div>
      </Route>
    </Application>
  </div>
)