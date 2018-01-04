import React, { Component, PropTypes } from 'react'

import config from '../config'
import tables from '../tables'

import BaseList from 'template-ui/lib/plugins2/crud/components/BaseList'

const icons = config.icons

const InstallationList = BaseList({
  title: 'Project',
  icon: config.icons.project,
  table: tables.installation,
  icons: config.icons,
  showHead: true,
  selectable: false,
  getToolbarButtons: (props) => {
    const add = ['add', 'Add', icons.add, {
      primary: true,
    }]
    const search = ['search', 'Search', icons.search, {}]
    return [add, search]
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

export default InstallationList