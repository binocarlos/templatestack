import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class UserWrapper extends Component {
  render() {
    return this.props.visible ?
      this.props.children :
      null
  }
}

export default connect(
  (state, ownProps) => {
    const requiredUser = typeof(ownProps.loggedIn) == 'boolean' ? ownProps.loggedIn : true
    const hasUser = state.value.user ? true : false
    return {
      visible: requiredUser == hasUser
    }
  }
)(UserWrapper)
