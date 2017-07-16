import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import FormContainer from 'template-ui/lib/plugins/form/Container'
import FormWrapper from 'template-ui/lib/components/FormWrapper'
import forms from '../forms'

import * as selectors from '../selectors'
import * as actions from '../actions'

const FORM_NAME = 'login'
const API_NAME = 'auth_login'

const Fields = FormContainer({
  name: FORM_NAME,
  fields: forms.login
})

class LoginForm extends Component {
  render() {
    return (
      <FormWrapper
        title='Login'
        submitTitle='Login'
        fields={ <Fields /> }
        loading={ this.props.loading }
        error={ this.props.error }
        submit={ this.props.submit }
      />
    )
  }
}

export default connect(
  (state, ownProps) => ({
    error: selectors.api.error(state, API_NAME),
    loading: selectors.api.loading(state, API_NAME)
  }),
  (dispatch) => ({
    submit: () => dispatch(actions.router.trigger('loginSubmit'))
  })
)(LoginForm)