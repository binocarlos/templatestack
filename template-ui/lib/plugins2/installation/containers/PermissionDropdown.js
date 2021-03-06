import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import authSelectors from '../../auth/selectors'
import PermissionDropdown from '../components/PermissionDropdown'

class PermissionDropdownContainer extends Component {
  render() {
    return (
      <PermissionDropdown {...this.props} />
    )
  }
}

export default connect(
  (state, ownProps) => {
    const row = ownProps.row || {}
    const user = authSelectors.user(state) || {}
    const readOnly = row && user && row.id == user.id
    return {
      readOnly
    }
  },
  (dispatch, ownProps) => {
    return {}
  }
)(PermissionDropdownContainer)