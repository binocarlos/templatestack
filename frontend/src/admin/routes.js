import React, { Component, PropTypes } from 'react'

import UserWrapper from 'template-ui/lib/containers/UserWrapper'
import RouteFactory from 'template-ui/lib/containers/Route'

import { processRoutes } from 'template-ui/lib/plugins2/router/tools'

import Section from 'template-ui/lib/components/Section'

import config from './config'

import Application from './containers/Application'
import LoginForm from './containers/LoginForm'
import RegisterForm from './containers/RegisterForm'
import ProjectList from './containers/ProjectList'
import ProjectForm from './containers/ProjectForm'

import Home from './components/Home'
import Layout from './components/Layout'


const Route = RouteFactory(config.basepath)

export const routeConfig = processRoutes({
  '': {},
  '/': {},
  '/dashboard': {},
  '/layout': {
    user: true,
    manualScroll: true
  },
  '/projects': {
    user: true,
    manualScroll: true,
    hooks: ['projectList'],
    '/add': {
      formmode: 'add',
      hooks: ['projectAdd']
    },
    '/edit/:id': {
      formmode: 'edit',
      hooks: ['projectEdit']
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

export const redirects = {
  projectListAdd: () => '/projects/add',
  projectListEdit: (id) => `/projects/edit/${id}`,
  projectFormCancel: () => '/projects'
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

    <Route path='/layout'>
      <Layout />
    </Route>

    <Route path='/projects' exact>
      <ProjectList />
    </Route>

    <Route path='/projects/add' exact>
      <ProjectForm />
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
)