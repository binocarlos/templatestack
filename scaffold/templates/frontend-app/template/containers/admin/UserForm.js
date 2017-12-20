import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import { redirects } from '../../routes'

import selectors from '../../selectors'
import actions from '../../actions'

import UserForm from '../../components/admin/UserForm'

const Form = reduxForm({
  form: 'user'
})(UserForm)

class UserFormContainer extends Component {
  render() {
    return (
      <Form {...this.props} />
    )
  }
}

export default connect(
  (state, ownProps) => ({
    valid: selectors.form.valid(state, 'user'),
    loading: selectors.api.loading(state, 'userForm'),
    error: selectors.api.error(state, 'userForm')
  }),
  (dispatch) => ({
    toolbarClick: (name, props) => {
      if(name == 'cancel') {
        dispatch(actions.router.redirect(redirects.userFormCancel()))
      }
      else if(name == 'save') {
        dispatch(actions.router.hook('userSave'))  
      }
    }
  })
)(UserFormContainer)