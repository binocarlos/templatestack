import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import selectors from '../selectors'
import actions from '../actions'

import { redirects } from '../routes'

import ProjectList from '../components/ProjectList'

class ProjectListContainer extends Component {
  render() {
    return (
      <ProjectList {...this.props} />
    )
  }
}

export default connect(
  (state, ownProps) => ({
    data: selectors.project.list.data(state),
    selected: selectors.project.list.selected(state),
    deleteActive: selectors.project.list.deleteWindow(state),
    loaded: selectors.api.loaded(state, 'projectList'),
    error: selectors.api.error(state, 'projectList')
  }),
  (dispatch) => ({
    onSelect: (data) => dispatch(actions.project.list.setSelected(data)),
    itemClick: (name, id, index) => {
      if(name == 'delete') {
        dispatch(actions.project.list.setSelected([index]))
        dispatch(actions.project.list.setDeleteWindow(true))
        return
      }
      else if(name == 'edit') {
        dispatch(actions.router.redirect(redirects.projectEdit(id)))
      }
    },
    toolbarClick: (name, selectedItems) => {
      if(name == 'delete') {
        dispatch(actions.project.list.setDeleteWindow(true))
      }
      else if(name == 'edit') {
        const item = selectedItems[0]
        if(item) {
          dispatch(actions.router.redirect(redirects.projectEdit(item.id)))
        }
      }
      else if(name == 'add') {
        dispatch(actions.router.redirect(redirects.projectAdd()))
      }
    },
    cancelDeleteWindow: () => {
      dispatch(actions.project.list.setDeleteWindow(false))
    },
    confirmDeleteWindow: () => {
      dispatch(actions.project.list.setDeleteWindow(false))
      dispatch(actions.router.hook('projectDelete'))
    }
  })
)(ProjectListContainer)