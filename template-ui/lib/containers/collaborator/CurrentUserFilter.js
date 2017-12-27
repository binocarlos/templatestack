import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import authSelectors from '../../plugins2/auth/selectors'

// do not show content if 'row.id' == currentuser.id
class CurrentUserFilter extends Component {
  render() {
    return this.props.readOnly ? null : this.props.children
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
)(CurrentUserFilter)