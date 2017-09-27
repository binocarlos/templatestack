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
    selected: selectors.value(state, 'installationsSelected') || []
  }),
  (dispatch) => ({
    onSelect: (data) => dispatch(actions.value.set('installationsSelected', data))
  })
)(InstallationListContainer)