import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import selectors from '../../selectors'
import actions from '../../actions'

import { redirects } from '../../routes'

import UserList from '../../components/admin/UserList'

class UserListContainer extends Component {
  render() {
    return (
      <UserList {...this.props} />
    )
  }
}

export default connect(
  (state, ownProps) => ({
    data: selectors.user.list.data(state),
    selected: selectors.user.list.selected(state),
    deleteActive: selectors.user.list.deleteWindow(state),
    loaded: selectors.api.loaded(state, 'userList'),
    error: selectors.api.error(state, 'userList')
  }),
  (dispatch) => ({
    onSelect: (data) => {
      dispatch(actions.user.list.setSelected(data))
    },
    itemClick: (name, item, index) => {
      if(name == 'delete') {
        dispatch(actions.user.list.setSelected([index]))
        dispatch(actions.user.list.setDeleteWindow(true))
        return
      }
      else if(name == 'edit') {
        dispatch(actions.router.redirect(redirects.projectListEdit(item.id)))
      }
    },
    toolbarClick: (name, selectedItems) => {
      if(name == 'delete') {
        dispatch(actions.user.list.setDeleteWindow(true))
      }
      else if(name == 'edit') {
        const item = selectedItems[0]
        if(item) {
          dispatch(actions.router.redirect(redirects.projectListEdit(item.id)))
        }
      }
      else if(name == 'add') {
        dispatch(actions.router.redirect(redirects.projectListAdd()))
      }
    },
    cancelDeleteWindow: () => {
      dispatch(actions.user.list.setDeleteWindow(false))
    },
    confirmDeleteWindow: () => {
      dispatch(actions.user.list.setDeleteWindow(false))
      dispatch(actions.router.hook('userDelete'))
    }
  })
)(UserListContainer)