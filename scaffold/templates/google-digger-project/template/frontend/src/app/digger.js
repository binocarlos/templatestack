import React, { Component, PropTypes } from 'react'

import Types from 'template-ui/lib/plugins2/digger/types'
import config from './config'
import forms from './forms'

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

const digger = Types({
  types,
  icons
})

export default digger