import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import options from 'template-tools/src/utils/options'

import apiSelectors from '../../api/selectors'
import routerActions from '../../router/actions'

const REQUIRED = [
  'name',
  'component',
  'actions',
  'selectors'
]


const CrudListFactory = (opts = {}) => {

  opts = options.processor(opts, {
    required: REQUIRED
  })

  const {
    name,
    actions,
    selectors
  } = opts

  return connect(
    (state, ownProps) => ({
      data: selectors.list.data(state),
      selected: selectors.list.selected(state),
      deleteActive: selectors.list.deleteWindow(state),
      loaded: apiSelectors.loaded(state, `${name}List`),
      error: apiSelectors.error(state, `${name}List`),
      icons: opts.icons,
    }),
    (dispatch) => ({
      onSelect: (data) => {
        dispatch(actions.list.setSelected(data))
      },
      itemClick: (actionName, item, index) => {
        if(actionName == 'delete') {
          dispatch(actions.list.setSelected([index]))
          dispatch(actions.list.setDeleteWindow(true))
          return
        }
        else if(actionName == 'edit') {
          dispatch(routerActions.hook(`${name}Edit`, item.id))
        }
      },
      toolbarClick: (actionName, selectedItems) => {
        if(actionName == 'delete') {
          dispatch(actions.list.setDeleteWindow(true))
        }
        else if(actionName == 'edit') {
          const item = selectedItems[0]
          if(item) {
            dispatch(routerActions.hook(`${name}Edit`, item.id))
          }
        }
        else if(actionName == 'add') {
          dispatch(routerActions.hook(`${name}Add`))
        }
      },
      cancelDeleteWindow: () => {
        dispatch(actions.list.setDeleteWindow(false))
      },
      confirmDeleteWindow: () => {
        dispatch(actions.list.setDeleteWindow(false))
        dispatch(routerActions.hook(`${name}Delete`))
      }
    })
  )(opts.component)

}

export default CrudListFactory