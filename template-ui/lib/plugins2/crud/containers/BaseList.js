import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import options from 'template-tools/src/utils/options'

import authSelectors from '../../auth/selectors'
import formSelectors from '../../form/selectors'
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

  const SearchFormWrapper = reduxForm({
    form: `${name}Search`
  })(opts.component)

  class ListContainer extends Component {
    render() {
      return (
        <SearchFormWrapper {...this.props} />
      )
    }
  }

  return connect(
    (state, ownProps) => ({
      data: selectors.list.data(state),
      selected: selectors.list.selected(state),
      deleteActive: selectors.list.deleteWindow(state),
      searchActive: selectors.list.searchWindow(state),
      loaded: apiSelectors.loaded(state, `${name}List`),
      error: apiSelectors.error(state, `${name}List`),
      icons: opts.icons,
      user: authSelectors.user(state),
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
        else {
          dispatch(routerActions.hook(`${name}TableAction`, {
            name: actionName,
            item
          }))
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
        else if(actionName == 'search') {
          dispatch(actions.list.setSearchWindow(true))
        }
      },
      cancelDeleteWindow: () => {
        dispatch(actions.list.setDeleteWindow(false))
      },
      confirmDeleteWindow: () => {
        dispatch(actions.list.setDeleteWindow(false))
        dispatch(routerActions.hook(`${name}Delete`))
      },
      cancelSearchWindow: () => {
        dispatch(actions.list.setSearchWindow(false))
      },
      confirmSearchWindow: () => {
        dispatch(actions.list.setSearchWindow(false))
        dispatch(routerActions.hook(`${name}List`))
      }
    })
  )(ListContainer)

}

export default CrudListFactory