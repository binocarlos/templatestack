import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import authSelectors from '../../auth/selectors'

// do not show content if 'row.id' != activeInstallation.id
class ActiveInstallationFilter extends Component {
  render() {
    return this.props.isActive ? this.props.children : null
  }
}

export default connect(
  (state, ownProps) => {
    const row = ownProps.row || {}
    const activeId = authSelectors.activeInstallationId(state)
    const isActive = row && activeId && row.id == activeId
    return {
      isActive
    }
  },
  (dispatch, ownProps) => {
    return {}
  }
)(ActiveInstallationFilter)