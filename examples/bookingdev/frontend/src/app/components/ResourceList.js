import React, { Component, PropTypes } from 'react'

import config from '../config'
import tables from '../tables'
import digger from '../digger'

import BaseList from 'template-ui/lib/plugins2/crud/components/BaseList'

const icons = config.icons

const ResourceList = BaseList({
  title: 'Resource',
  icon: config.icons.folder,
  table: tables.digger,
  icons: config.icons,
  showHead: true,
  selectable: false,
  noLoading: true,
  getTitle: (props) => {
    if(!props.selectedTreeItem) return 'Resources'
    return props.selectedTreeItem.name
  },
  getIcon: (props) => {
    const selectedItem = props.selectedTreeItem || {}
    return digger.getIcon(selectedItem)    
  },
  getToolbarButtons: (props) => {
    const selectedItem = props.selectedTreeItem || {}
    if(!selectedItem) return []
    const childTypes = digger.getChildrenTypes(selectedItem)
    const add = ['add', 'Add', icons.add, {
      primary: true,
      floating: true,
      mini: true,
      style: {
        marginRight: '5px'
      }
    }, 
      childTypes.map(type => {
        const schema = digger.types[type]
        return [type, schema.title, schema.icon]
      })
    ]
    const search = ['search', 'Search', icons.search, {}]
    const up = ['up', 'Up', icons.up, {}]
    if(digger.isLeaf(selectedItem)) return []
    if(digger.isRoot(selectedItem)) return [add, search]
    return [add, up, search]
  },
  getRowButtons: (row, props, index) => {
    let ret = []
    if(row.type == 'folder') {
      ret.push(['open', 'Open', icons.folderopen, {}])
    }
    ret.push(['delete', 'Delete', icons.delete, {}])
    ret.push(['edit', 'Edit', icons.edit, {}])
    return ret
  }
})

export default ResourceList