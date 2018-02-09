import React, { Component, PropTypes } from 'react'

import RouteFactory from 'template-ui/lib/containers/Route'

import { processRoutes } from 'template-ui/lib/plugins2/router/tools'

import Section from 'template-ui/lib/components/Section'

import config from './config'

import Application from './containers/Application'
import Home from './components/Home'

import selectors from './selectors'

const Route = RouteFactory(config.basepath)

export const routeConfig = processRoutes({
  '': {
    redirect: '/dashboard'
  },
  '/': {
    redirect: '/dashboard'
  },
  '/dashboard': {
    hooks: []
  },
}, config.basepath)

export const redirects = {
  
}

export const routes = (
  <Application>
    <Route path='/dashboard'>
      <Section>
        <div>Hello this is the dashboard</div>
      </Section>
    </Route>
  </Application>
)