import React, { Component, PropTypes } from 'react'

import config from '../config'
import tables from '../tables'

import BaseList from 'template-ui/lib/plugins2/crud/components/BaseList'

const icons = config.icons

const UserList = BaseList({
  title: 'User',
  icon: config.icons.users,
  table: tables.user,
  icons: config.icons,
  showHead: true,
  selectable: false,
  searchActive: true,
  activeButtons: {
    'edit': true,
    'search': true
  },
  getRowButtons: (row, props, index) => {
    return [
      //['edit', 'Edit', icons.edit, {}],
    ]
  }
})

export default UserList