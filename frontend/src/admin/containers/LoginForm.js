import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import selectors from '../selectors'
import actions from '../actions'

import LoginForm from '../components/LoginForm'

const Form = reduxForm({
  name: 'authLogin'
})(LoginForm)

class LoginFormContainer extends Component {
  render() {
    return (
      <Form {...this.props} />
    )
  }
}

export default connect(
  (state, ownProps) => ({
    error: selectors.api.error(state, 'authLogin'),
    loading: selectors.api.loading(state, 'authLogin')
  }),
  (dispatch) => ({
    submit: () => dispatch(actions.router.hook('authLoginSubmit'))
  })
)(LoginFormContainer)