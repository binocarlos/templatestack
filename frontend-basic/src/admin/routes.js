import React, { Component, PropTypes } from 'react'

import UserWrapper from 'template-ui/lib/containers/UserWrapper'
import RouteFactory from 'template-ui/lib/containers/Route'

import { processRoutes } from 'template-ui/lib/plugins2/router/tools'

import Section from 'template-ui/lib/components/Section'

import config from './config'

import Application from './containers/Application'
import LoginForm from './containers/LoginForm'
import Home from './components/Home'

const Route = RouteFactory(config.basepath)

export const routeConfig = processRoutes({
  '': {},
  '/': {},
  '/dashboard': {},
  },
  '/help': {
    triggers: []
  },
  '/login': {
  }
}, config.basepath)

export const redirects = {
  
}

export const routes = (
  <Application>
    <Route home>
      <Section>
        <UserWrapper loggedIn={ false }>
          <LoginForm />
        </UserWrapper>
        <UserWrapper loggedIn={ true }>
          <Home />
        </UserWrapper>
      </Section>
    </Route>

    <Route path='/dashboard'>
      <Section>
        <Home />
      </Section>
    </Route>

    <Route path='/help'>
      <Section>
        Help
      </Section>
    </Route>

    <Route path='/login'>
      <Section>
        <LoginForm />
      </Section>
    </Route>
  
  </Application>
)