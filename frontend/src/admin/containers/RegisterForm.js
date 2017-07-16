import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import FormContainer from 'template-ui/lib/plugins/form/Container'
import FormWrapper from 'template-ui/lib/components/FormWrapper'
import forms from '../forms'

import * as selectors from '../selectors'
import * as actions from '../actions'

const FORM_NAME = 'register'
const API_NAME = 'auth_register'

const Fields = FormContainer({
  name: FORM_NAME,
  fields: forms.register
})

class RegisterForm extends Component {
  render() {
    return (
      <FormWrapper
        title='Register'
        submitTitle='Register'
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
    submit: () => dispatch(actions.router.trigger('registerSubmit'))
  })
)(RegisterForm)