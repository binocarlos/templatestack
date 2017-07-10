import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Navigation from 'react-toolbox/lib/navigation'
import FormContainer from 'template-ui/lib/plugins/form/Container'
import forms from '../forms'

import * as actions from '../actions'

const Fields = FormContainer({
  name: 'login',
  fields: forms.login
})

class LoginForm extends Component {
  render() {
    const actions = [
      { label: 'Login', raised: true, primary: true, onClick: this.props.submit }
    ]
    return (
      <div>
        <div>Login</div>
        <Fields />
        <Navigation
          type='horizontal'
          actions={actions}
        />
      </div>
    )
  }
}

export default connect(
  (state, ownProps) => ({}),
  (dispatch) => ({
    submit: () => dispatch(actions.router.trigger('loginSubmit'))
  })
)(LoginForm)