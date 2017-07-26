import React, { Component, PropTypes } from 'react'

import UserWrapper from 'template-ui/lib/plugins/auth/UserWrapper'
import RouteFactory from 'template-ui/lib/plugins/router/Route'
import { processRoutes } from 'template-ui/lib/utils/routes'

import Section from 'template-ui/lib/components/Section'

import config from './config'

import Application from './containers/Application'
import LoginForm from './containers/LoginForm'
import RegisterForm from './containers/RegisterForm'

import Home from './components/Home'

const Route = RouteFactory(config.basepath)

export const routeConfig = processRoutes({
  '/': {},
  '/help': {
    triggers: []
  },
  '/about': {
    //user: true,
    //autoScroll: false,
  },
  '/login': {
  },
  '/register': {
  }
}, config.basepath)

export const routes = (
  <div>
    <Application>
      <Route home>
        <Section>
          <UserWrapper loggedIn={ false }>
            <Home />
          </UserWrapper>
          <UserWrapper loggedIn={ true }>
            Logged In!
          </UserWrapper>
        </Section>
      </Route>

      <Route path='/help'>
        <div>
          Help
        </div>
      </Route>

      <Route path='/login'>
        <Section>
          <LoginForm />
        </Section>
      </Route>

      <Route path='/register'>
        <Section>
          <RegisterForm />
        </Section>
      </Route>      
    </Application>
  </div>
)