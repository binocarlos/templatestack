import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import * as selectors from '../selectors'
import * as actions from '../actions'

import InstallationForm from '../components/InstallationForm'

class InstallationFormContainer extends Component {
  render() {
    return (
      <InstallationForm {...this.props} />
    )
  }
}

export default connect(
  (state, ownProps) => ({
    
  }),
  (dispatch) => ({
    
  })
)(InstallationFormContainer)