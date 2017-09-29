import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import selectors from '../selectors'
import actions from '../actions'

import RegisterForm from '../components/RegisterForm'

const Form = reduxForm({
  form: 'authRegister'
})(RegisterForm)

class RegisterFormContainer extends Component {
  render() {
    return (
      <Form {...this.props} />
    )
  }
}

export default connect(
  (state, ownProps) => ({
    error: selectors.api.error(state, 'authRegister'),
    loading: selectors.api.loading(state, 'authRegister')
  }),
  (dispatch) => ({
    submit: () => dispatch(actions.router.hook('authRegisterSubmit'))
  })
)(RegisterFormContainer)