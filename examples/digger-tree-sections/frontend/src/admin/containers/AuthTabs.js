import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import selectors from '../selectors'
import actions from '../actions'

import AuthTabs from '../components/AuthTabs'

const ROUTES = [
  'login',
  'register'
]

class AuthTabsContainer extends Component {
  render() {
    return (
      <AuthTabs {...this.props} />
    )
  }
}

export default connect(
  (state, ownProps) => ({
    index: selectors.router.info(state, 'authTab') || 0,
  }),
  (dispatch) => ({
    onTabChange: (index) => dispatch(actions.router.redirect(`/${ROUTES[index]}`))
  })
)(AuthTabsContainer)