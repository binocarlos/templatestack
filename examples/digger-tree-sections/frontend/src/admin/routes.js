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
import CalendarEditor from './containers/CalendarEditor'

import Home from './components/Home'

import selectors from './selectors'

const ConfigTree = digger.config.TreeContainer
const ConfigList = digger.config.ListContainer
const ConfigForm = digger.config.FormContainer

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
  '/companies': {
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
  '/config': {
    redirect: '/config/bookingForm'
  },
  '/config/:namespace': {
    hooks: ['configList', 'configDescendents'],
    '/view/:viewid': {
      hooks: ['configList', 'configDescendents'],
      '/add/:type': {
        formmode: 'add',
        hooks: ['configLoad', 'configDescendents']
      },
      '/edit/:id': {
        formmode: 'add',
        hooks: ['configLoad', 'configDescendents']
      },
    },
    '/add/:type': {
      formmode: 'add',
      hooks: ['configLoad', 'configDescendents']
    },
    '/edit/:id': {
      formmode: 'add',
      hooks: ['configLoad', 'configDescendents']
    },
  },
  '/calendar': {
    bookingFormsSection: 'calendar',
    hooks: ['bookingFormsRedirect'],
  },
  '/calendar/:bookingFormId': {
    bookingFormsSection: 'calendar',
    hooks: ['bookingFormsList', 'calendarLoad'],
    '/:date/:days': {
      bookingFormsSection: 'calendar',
      hooks: ['bookingFormsList', 'calendarLoad'],
    }
  },
}, config.basepath)

export const redirects = {
  installationAdd: () => `/companies/add`,
  installationEdit: (id) => `/companies/edit/${id}`,
  installationCancel: () => `/companies`,
  configAdd: (payload, state) => {
    const namespace = selectors.router.param(state, 'namespace')
    const viewid = selectors.router.param(state, 'viewid')
    if(viewid) {
      return `/config/${namespace}/view/${viewid}/add/${payload}`
    }
    else {
      return `/config/${namespace}/add/${payload}`
    }
  },
  configView: (item, state) => {
    if(!item) return '/config'

    return item.id ? 
      `/config/${item.namespace}/view/${item.id}` 
      : `/config/${item.namespace}`
  },
  configEdit: (id, state) => {
    const namespace = selectors.router.param(state, 'namespace')
    const viewid = selectors.router.param(state, 'viewid')
    if(viewid) {
      return `/config/${namespace}/view/${viewid}/edit/${id}`
    }
    else {
      return `/config/${namespace}/edit/${id}`
    }
    
  },
  configCancel: (payload, state) => {
    const namespace = selectors.router.param(state, 'namespace')
    const viewid = selectors.router.param(state, 'viewid')
    if(viewid) {
      return `/config/${namespace}/view/${viewid}`
    }
    else {
      return `/config/${namespace}`
    }
  },
  userEdit: (id) => `/users/edit/${id}`,
  userCancel: () => `/users`,
  calendarRange: (payload, state) => {
    const bookingFormId = selectors.bookingForms.currentId(state)
    if(!payload) {
      return `/calendar/${bookingFormId}`
    }
    else {
      const start = payload.start
      const days = payload.days
      return `/calendar/${bookingFormId}/${start}/${days}`
    }
  }
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

    <Route path='/companies' exact>
      <InstallationList />
    </Route>

    <Route path='/companies/add' exact>
      <InstallationForm />
    </Route>

    <Route route='/companies/edit/:id' exact>
      <InstallationForm />
    </Route>

    <Route route='/companies/edit/:id' exact>
      <InstallationForm />
    </Route>

    <Route route='/calendar/:bookingFormId'>
      <CalendarEditor />
    </Route>

    <Route route='/config/:namespace'>
      <ConfigTree>
        <Route route='/config/:namespace' exact>
          <ConfigList />
        </Route>
        <Route route='/config/:namespace/add/:type' exact>
          <ConfigForm />
        </Route>
        <Route route='/config/:namespace/edit/:id' exact>
          <ConfigForm />
        </Route>
        <Route route='/config/:namespace/view/:viewid' exact>
          <ConfigList />
        </Route>
        <Route route='/config/:namespace/view/:viewid/add/:type' exact>
          <ConfigForm />
        </Route>
        <Route route='/config/:namespace/view/:viewid/edit/:id' exact>
          <ConfigForm />
        </Route>
      </ConfigTree>
    </Route>

  </Application>
)