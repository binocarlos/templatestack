import React, { Component, PropTypes } from 'react'

import Factory from 'template-ui/lib/plugins2/crud/factory'
import InstallationSaga from 'template-ui/lib/plugins2/installation/saga'
import TabForm from 'template-ui/lib/plugins2/crud/components/TabForm'

import apitools from './api/tools'
import config from './config'
import forms from './forms'
import tables from './tables'
import apis from './api'

const icons = config.icons

const user = Factory({
  name: 'user',
  title: 'User',
  api: apis.user,
  form: forms.user,
  table: tables.user,
  icon: icons.users,
  icons
})

const installationForm = TabForm({
  title: 'Project',
  icon: icons.project,
  tabs: [{
    label: 'Details',
    fields: forms.installationCore
  }, {
    label: 'Collaborators',
    fields: forms.installationCollaborators
  }],
  icons: config.icons,
})

const installation = Factory({
  name: 'installation',
  title: 'Project',
  api: apis.installation,
  form: forms.installation,
  table: tables.installation,
  icon: icons.users,
  icons,
  FormComponent: installationForm,
  getSaga: (opts = {}) => {
    const { actions, selectors, api } = opts
    return InstallationSaga({
      actions,
      selectors,
      apis: api,
    })
  },
  getRowButtons: (row, props, index) => {
    const permission = row.collaboration_meta.permission

    let ret = []

    ret.push(['open', 'Load Project', icons.star, {}])

    if(permission == 'owner') {
      ret.push(['delete', 'Delete', icons.delete, {}])
      ret.push(['edit', 'Edit', icons.edit, {}])
    }
    
    return ret
  }
})

const cruds = {
  user,
  installation,
}

export default cruds