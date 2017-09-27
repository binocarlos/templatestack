import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import * as selectors from '../selectors'
import * as actions from '../actions'

import InstallationList from '../components/InstallationList'

class InstallationListContainer extends Component {
  render() {
    return (
      <InstallationList {...this.props} />
    )
  }
}

export default connect(
  (state, ownProps) => ({
    data: selectors.value(state, 'installations'),
    selected: selectors.value(state, 'installationsSelected') || [],
    deleteActive: selectors.value(state, 'installationDeleteWindowOpen') ? true : false
  }),
  (dispatch) => ({
    onSelect: (data) => dispatch(actions.value.set('installationsSelected', data)),
    itemClick: (name, id, index) => {
      if(name == 'delete') {
        dispatch(actions.value.set('installationsSelected', [index]))
        dispatch(actions.value.set('installationDeleteWindowOpen', true))
        return
      }
      else if(name == 'edit') {
        dispatch(actions.router.redirect(`/projects/edit/${id}`))
      }
    },
    toolbarClick: (name, selectedItems) => {
      if(name == 'delete') {
        dispatch(actions.value.set('installationDeleteWindowOpen', true))
      }
      else if(name == 'edit') {
        const item = selectedItems[0]
        if(item) {
          dispatch(actions.router.redirect(`/projects/edit/${item.id}`))
        }
      }
      else if(name == 'add') {
        dispatch(actions.router.redirect('/projects/add'))
      }
    },
    cancelDeleteWindow: () => {
      dispatch(actions.value.set('installationDeleteWindowOpen', false))
    },
    confirmDeleteWindow: () => {
      dispatch(actions.value.set('installationDeleteWindowOpen', false))
      dispatch(actions.router.hook('installationDelete'))
    }
  })
)(InstallationListContainer)