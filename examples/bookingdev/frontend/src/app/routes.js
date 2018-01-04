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

const SettingsTree = digger.settings.TreeContainer
const SettingsList = digger.settings.ListContainer
const SettingsForm = digger.settings.FormContainer

const BookingFormList = digger.bookingForm.ListContainer
const BookingFormForm = digger.bookingForm.FormContainer

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
  '/settings': {
    hooks: ['settingsList', 'settingsDescendents'],
    '/view/:viewid': {
      hooks: ['settingsList', 'settingsDescendents'],
      '/add/:type': {
        formmode: 'add',
        hooks: ['settingsLoad', 'settingsDescendents']
      },
      '/edit/:id': {
        formmode: 'add',
        hooks: ['settingsLoad', 'settingsDescendents']
      },
    },
    '/add/:type': {
      formmode: 'add',
      hooks: ['settingsLoad', 'settingsDescendents']
    },
    '/edit/:id': {
      formmode: 'add',
      hooks: ['settingsLoad', 'settingsDescendents']
    },
  },
  '/bookingForms': {
    hooks: ['bookingFormList'],
    '/add/:type': {
      formmode: 'add',
      hooks: ['bookingFormLoad']
    },
    '/edit/:id': {
      formmode: 'add',
      hooks: ['bookingFormLoad']
    },
  },
}, config.basepath)

export const redirects = {
  installationAdd: () => `/projects/add`,
  installationEdit: (id) => `/projects/edit/${id}`,
  installationCancel: () => `/projects`,
  settingsAdd: (payload, state) => {
    const viewid = selectors.router.param(state, 'viewid')
    if(viewid) {
      return `/settings/view/${viewid}/add/${payload}`
    }
    else {
      return `/settings/add/${payload}`
    }
  },
  settingsView: (id, state) => `/settings${id ? '/view/' + id : ''}`,
  settingsEdit: (id, state) => {
    const viewid = selectors.router.param(state, 'viewid')
    if(viewid) {
      return `/settings/view/${viewid}/edit/${id}`
    }
    else {
      return `/settings/edit/${id}`
    }
    
  },
  settingsCancel: (payload, state) => {
    const viewid = selectors.router.param(state, 'viewid')
    if(viewid) {
      return `/settings/view/${viewid}`
    }
    else {
      return `/settings`
    }
  },
  bookingFormAdd: () => `/bookingForms/add/bookingForm`,
  bookingFormEdit: (id) => `/bookingForms/edit/${id}`,
  bookingFormCancel: () => `/bookingForms`,
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

    <Route path='/settings'>
      <SettingsTree>
        <Route path='/settings' exact>
          <SettingsList />
        </Route>
        <Route route='/settings/add/:type' exact>
          <SettingsForm />
        </Route>
        <Route route='/settings/edit/:id' exact>
          <SettingsForm />
        </Route>
        <Route route='/settings/view/:viewid' exact>
          <SettingsList />
        </Route>
        <Route route='/settings/view/:viewid/add/:type' exact>
          <SettingsForm />
        </Route>
        <Route route='/settings/view/:viewid/edit/:id' exact>
          <SettingsForm />
        </Route>
      </SettingsTree>
    </Route>

    <Route path='/bookingForms' exact>
      <BookingFormList />
    </Route>
    <Route route='/bookingForms/add/:type' exact>
      <BookingFormForm />
    </Route>
    <Route route='/bookingForms/edit/:id' exact>
      <BookingFormForm />
    </Route>

  </Application>
)