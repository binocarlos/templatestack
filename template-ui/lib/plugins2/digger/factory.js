import React, { Component, PropTypes } from 'react'
import { take, put, call, fork, select, all, takeLatest, takeEvery, cancel } from 'redux-saga/effects'

import options from 'template-tools/src/utils/options'
import IconBadge from 'template-ui/lib/components/widgets/IconBadge'

import BaseTreeContainer from './containers/BaseTree'
import BaseTreeComponent from './components/BaseTree'

import BaseListContainer from '../crud/containers/BaseList'
import BaseListComponent from '../crud/components/BaseList'

import BaseFormContainer from '../crud/containers/BaseForm'
import BaseFormComponent from '../crud/components/BaseForm'

import Actions from './actions'
import Selectors from './selectors'
import Types from './types'
import Saga from './saga'

const REQUIRED = [
  'name',
  'title',
  'api',
  'types',
  'icons'
]

const Factory = (opts = {}) => {

  opts = options.processor(opts, {
    required: REQUIRED
  })

  const api = opts.api
  const types = Types(opts)
  const actions = Actions({name: opts.name})
  const selectors = Selectors({name: opts.name})

  const icons = opts.icons

  function* loadInitialData(payload) {
    return types.getInitialData(payload.type)
  }

  const saga = Saga({
    name: opts.name,
    namespace: opts.namespace,
    getNamespace: opts.getNamespace,
    actions,
    selectors,
    apis: api,
    descendentType: opts.descendentType,
    loadInitialData,
    processTreeData: (data) => {
      if(opts.rootItem) {
        const rootItem = Object.assign({}, opts.rootItem)
        rootItem.type = 'root'
        rootItem.children = data
        return [rootItem]
      }
      else {
        return data
      }
    },
  })


  const table = {
    name: {
      getValue: (row, props, index) => {
        return (
          <IconBadge
            name={ row.name }
            icon={ types.getIcon(row) }
            primary={ row.type != 'folder' }
            dark={ row.type == 'folder' }
          />
        )
      }
    },
    type: {}
  }

  /*
  
    components
    
  */

  const TreeComponent = opts.TreeComponent || BaseTreeComponent({
    width: '250px',
    getIcon: types.getIcon
  })

  const icon = opts.icon || opts.icons.folder

  const ListComponent = opts.ListComponent || BaseListComponent({
    title: opts.title,
    icon,
    table,
    icons: opts.icons,
    showHead: true,
    selectable: false,
    noLoading: true,
    getTitle: (props) => {
      if(opts.noTree) return opts.title
      if(!props.selectedTreeItem) return ''
      return props.selectedTreeItem.name
    },
    getIcon: (props) => {
      if(opts.noTree) return icon
      const selectedItem = props.selectedTreeItem || {}
      return types.getIcon(selectedItem)    
    },
    getToolbarButtons: (props) => {
      const selectedItem = props.selectedTreeItem
      const childTypes = opts.childTypes || types.getChildrenTypes(selectedItem || {})
      const add = ['add', 'Add', icons.add, {
        primary: true,
        floating: true,
        mini: true,
        style: {
          marginRight: '5px'
        }
      }, 
        childTypes.map(type => {
          const schema = types.types[type]
          return [type, schema.title, schema.icon]
        })
      ]
      const search = ['search', 'Search', icons.search, {}]
      const up = ['up', 'Up', icons.up, {}]

      if(!opts.noTree && !selectedItem) return []
      if(!opts.noTree && types.isLeaf(selectedItem || {})) return []
      if(opts.noTree || types.isRoot(selectedItem || {})) return [add, search]
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


  const FormComponent = opts.FormComponent || BaseFormComponent({
    title: opts.title,
    getIcon: (props) => {
      const item = props.formvalues || {}
      return types.getIcon(item)
    },
    getTitle: (props) => {
      const item = props.formvalues || {}
      if(item.id) return item.name
      const schemaTitle = types.getTitle(item)
      return `New ${schemaTitle}`
    },
    getForm: (props) => {
      const item = props.formvalues || {}
      return types.getForm(item)
    },
    icons: opts.icons,
  })

  /*
  
    containers
    
  */

  const TreeContainer = BaseTreeContainer({
    name: opts.name,
    component: TreeComponent,
    actions,
    selectors,
  })


  const ListContainer = BaseListContainer({
    name: opts.name,
    component: ListComponent,
    actions,
    selectors,
    icons: opts.icons,
    getProps: (state, ownProps) => {
      return {
        selectedTreeItem: selectors.tree.selectedItem(state)
      }
    }
  })


  const FormContainer = BaseFormContainer({
    name: opts.name,
    component: FormComponent,
    getIcon: (props) => {
      return types.getIcon(props.data)
    },
    getForm: (props) => {
      const item = props.data
      return types.getType(item.type)
    }
  })


  return {
    types,
    actions,
    selectors,
    saga,
    table,
    TreeComponent,
    TreeContainer,
    ListComponent,
    ListContainer,
    FormComponent,
    FormContainer,
  }
}

export default Factory