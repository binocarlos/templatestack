import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import * as actions from '../actions'

import {
  valueSelectors
} from '../selectors'

import Application from '../components/layout/Application'

class ApplicationContainer extends Component {
  render() {
    return (
      <Application {...this.props} />
    )
  }
}

export default connect(
  (state, ownProps) => {
    console.log('-------------------------------------------');
    console.log(valueSelectors.menuOpen(state))
    return {
      menuOpen: valueSelectors.menuOpen(state),
      user: valueSelectors.user(state)
    }
  },
  (dispatch) => {
    return {
      toggleMenu: () => dispatch(actions.value.toggle('menuOpen')),
      onMenuClick: (id) => dispatch(actions.application.menuClick(id))
    }
  }
)(ApplicationContainer)