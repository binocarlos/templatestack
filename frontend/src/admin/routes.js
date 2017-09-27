import React, { Component, PropTypes } from 'react'

import UserWrapper from 'template-ui/lib/plugins/auth/UserWrapper'
import RouteFactory from 'template-ui/lib/plugins/router/Route'
import { processRoutes } from 'template-ui/lib/utils/routes'

import Section from 'template-ui/lib/components/Section'

import config from './config'

import Application from './containers/Application'
import LoginForm from './containers/LoginForm'
import RegisterForm from './containers/RegisterForm'
import InstallationList from './containers/InstallationList'
import InstallationForm from './containers/InstallationForm'

import Home from './components/Home'
import Layout from './components/Layout'


const Route = RouteFactory(config.basepath)

export const routeConfig = processRoutes({
  '': {},
  '/': {},
  '/dashboard': {},
  '/layout': {
    manualScroll: true
  },
  '/projects': {
    manualScroll: true,
    hooks: ['installationList'],
    '/add': {

    }
  },
  '/help': {
    triggers: []
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

      <Route path='/layout'>
        <Layout />
      </Route>

      <Route path='/projects' exact>
        <InstallationList />
      </Route>

      <Route path='/projects/add' exact>
        <InstallationForm />
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

      <Route path='/register'>
        <Section>
          <RegisterForm />
        </Section>
      </Route>      
    </Application>
  </div>
)