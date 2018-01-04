import React, { Component, PropTypes } from 'react'

import Factory from 'template-ui/lib/plugins2/digger/factory'
import apitools from './api/tools'
import config from './config'
import forms from './forms'
import apis from './api'

const icons = config.icons

const folder = {
  type: 'folder',
  form: {
    type: 'normal',
    fields: forms.folder
  },
  title: 'Folder',
  icon: icons.folder,
  children: ['folder', 'item'],
}

const item = {
  type: 'item',
  form: {
    type: 'normal',
    fields: forms.item
  },
  title: 'Item',
  icon: icons.item,
  leaf: true,
}

const types = {
  folder,
  item,
}

const resource = Factory({
  title: 'Resource',
  name: 'resource',
  api: apis.resource,
  namespace: 'resource',
  types,
  icons,
  descendentType: 'folder',
  rootItem: {
    name: 'Resources',
  }
})

const diggers = {
  resource
}

export default diggers