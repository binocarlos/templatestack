import React, { Component, PropTypes } from 'react'
import { take, put, call, fork, select, all, takeLatest, takeEvery, cancel } from 'redux-saga/effects'

import options from 'template-tools/src/utils/options'
import IconBadge from 'template-ui/lib/components/widgets/IconBadge'

import BaseListContainer from './containers/BaseList'
import BaseListComponent from './components/BaseList'

import BaseFormContainer from './containers/BaseForm'
import BaseFormComponent from './components/BaseForm'

import Actions from './actions'
import Selectors from './selectors'
import Saga from './saga'

const REQUIRED = [
  'name',
  'title',
  'api',
  'table',
  'icon',
  'icons'
]

const Factory = (opts = {}) => {

  opts = options.processor(opts, {
    required: REQUIRED
  })

  const api = opts.api
  const actions = Actions({name: opts.name})
  const selectors = Selectors({name: opts.name})

  const icons = opts.icons

  function* loadInitialData(payload) {
    if(opts.loadInitialData) {
      return opts.loadInitialData(payload)
    }
    else {
      return opts.initialData || {}  
    }
  }


  const defaultGetRowButtons = (row, props, index) => {
    let ret = []
    ret.push(['delete', 'Delete', icons.delete, {}])
    ret.push(['edit', 'Edit', icons.edit, {}])
    return ret
  }

  const defaultGetToolbarButtons = (props) => {
    const add = ['add', 'Add', icons.add, {
      primary: true,
    }]
    const search = ['search', 'Search', icons.search, {}]
    return [add, search]
  }

  const saga = opts.getSaga ? opts.getSaga({
    actions,
    selectors,
    api
  }) : Saga({
    name: opts.name,
    actions,
    selectors,
    apis: api,
    loadInitialData,
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

  const ListComponent = opts.ListComponent || BaseListComponent({
    title: opts.title,
    icon: opts.icon,
    table: opts.table,
    icons: opts.icons,
    showHead: true,
    selectable: false,
    noLoading: true,
    getToolbarButtons: opts.getToolbarButtons || defaultGetToolbarButtons,
    getRowButtons: opts.getRowButtons || defaultGetRowButtons
  })


  const FormComponent = opts.FormComponent || BaseFormComponent({
    title: opts.title,
    icon: opts.icon,
    form: opts.form,
    icons: opts.icons,
  })

  /*
  
    containers
    
  */

  const ListContainer = BaseListContainer({
    name: opts.name,
    component: ListComponent,
    actions,
    selectors,
    icons: opts.icons,
  })


  const FormContainer = BaseFormContainer({
    name: opts.name,
    component: FormComponent,
  })


  return {    
    actions,
    selectors,
    saga,
    api,
    ListComponent,
    ListContainer,
    FormComponent,
    FormContainer,
  }
}

export default Factory