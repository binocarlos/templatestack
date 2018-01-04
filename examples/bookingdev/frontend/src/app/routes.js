import React, { Component, PropTypes } from 'react'

import UserWrapper from 'template-ui/lib/containers/UserWrapper'
import RouteFactory from 'template-ui/lib/containers/Route'

import { processRoutes } from 'template-ui/lib/plugins2/router/tools'

import Section from 'template-ui/lib/components/Section'

import config from './config'
import digger from './digger'
import crud from './crud'

import Application from './containers/Application'
import LoginForm from './containers/LoginForm'
import RegisterForm from './containers/RegisterForm'
import AuthTabs from './containers/AuthTabs'

import Home from './components/Home'

import selectors from './selectors'

const ResourceTree = digger.resource.TreeContainer
const ResourceList = digger.resource.ListContainer
const ResourceForm = digger.resource.FormContainer

const UserList = crud.user.ListContainer
const UserForm = crud.user.FormContainer

const InstallationList = crud.installation.ListContainer
const InstallationForm = crud.installation.FormContainer

const Route = RouteFactory(config.basepath)

export const routeConfig = processRoutes({
  '': {
    hooks: []
  },
  '/': {
    hooks: []
  },
  '/dashboard': {
    hooks: []
  },
  '/help': {
    hooks: []
  },
  '/login': {
    authTab: 0,
  },
  '/register': {
    authTab: 1,
  },
  '/users': {
    hooks: ['userList'],
    '/edit/:id': {
      formmode: 'edit',
      hooks: ['userLoad']
    }
  },
  '/projects': {
    hooks: ['installationList'],
    '/add': {
      formmode: 'add',
      hooks: ['installationLoad']
    },
    '/edit/:id': {
      formmode: 'edit',
      hooks: ['installationLoad']
    }
  },
  '/resources': {
    hooks: ['resourceList', 'resourceDescendents'],
    '/view/:viewid': {
      hooks: ['resourceList', 'resourceDescendents'],
      '/add/:type': {
        formmode: 'add',
        hooks: ['resourceLoad', 'resourceDescendents']
      },
      '/edit/:id': {
        formmode: 'add',
        hooks: ['resourceLoad', 'resourceDescendents']
      },
    },
    '/add/:type': {
      formmode: 'add',
      hooks: ['resourceLoad', 'resourceDescendents']
    },
    '/edit/:id': {
      formmode: 'add',
      hooks: ['resourceLoad', 'resourceDescendents']
    },
  },
}, config.basepath)

export const redirects = {
  installationAdd: () => `/projects/add`,
  installationEdit: (id) => `/projects/edit/${id}`,
  installationCancel: () => `/projects`,
  resourceAdd: (payload, state) => {
    const viewid = selectors.router.param(state, 'viewid')
    if(viewid) {
      return `/resources/view/${viewid}/add/${payload}`
    }
    else {
      return `/resources/add/${payload}`
    }
  },
  resourceView: (id, state) => `/resources${id ? '/view/' + id : ''}`,
  resourceEdit: (id, state) => {
    const viewid = selectors.router.param(state, 'viewid')
    if(viewid) {
      return `/resources/view/${viewid}/edit/${id}`
    }
    else {
      return `/resources/edit/${id}`
    }
    
  },
  resourceCancel: (payload, state) => {
    const viewid = selectors.router.param(state, 'viewid')
    if(viewid) {
      return `/resources/view/${viewid}`
    }
    else {
      return `/resources`
    }
  },
  userEdit: (id) => `/users/edit/${id}`,
  userCancel: () => `/users`,
}

export const routes = (
  <Application>
    <Route home>
      <Section>
        <UserWrapper loggedIn={ false }>
          <AuthTabs />
        </UserWrapper>
        <UserWrapper loggedIn={ true }>
          <div>sup</div>
        </UserWrapper>
      </Section>
    </Route>

    <Route path='/dashboard'>
      <Section>
        <div>Hello this is the dashboard</div>
      </Section>
    </Route>

    <Route path='/help'>
      <Section>
        Help
      </Section>
    </Route>

    <Route path='/login'>
      <Section>
        <AuthTabs />
      </Section>
    </Route>

    <Route path='/register'>
      <Section>
        <AuthTabs />
      </Section>
    </Route>

    <Route path='/users' exact>
      <UserList />
    </Route>

    <Route route='/users/edit/:id' exact>
      <UserForm />
    </Route>

    <Route path='/projects' exact>
      <InstallationList />
    </Route>

    <Route path='/projects/add' exact>
      <InstallationForm />
    </Route>

    <Route route='/projects/edit/:id' exact>
      <InstallationForm />
    </Route>

    <Route path='/resources'>
      <ResourceTree>
        <Route path='/resources' exact>
          <ResourceList />
        </Route>
        <Route route='/resources/add/:type' exact>
          <ResourceForm />
        </Route>
        <Route route='/resources/edit/:id' exact>
          <ResourceForm />
        </Route>
        <Route route='/resources/view/:viewid' exact>
          <ResourceList />
        </Route>
        <Route route='/resources/view/:viewid/add/:type' exact>
          <ResourceForm />
        </Route>
        <Route route='/resources/view/:viewid/edit/:id' exact>
          <ResourceForm />
        </Route>
      </ResourceTree>
    </Route>

  </Application>
)