import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import { redirects } from '../routes'

import selectors from '../selectors'
import actions from '../actions'

import ProjectForm from '../components/ProjectForm'

const Form = reduxForm({
  form: 'project'
})(ProjectForm)

class ProjectFormContainer extends Component {
  render() {
    return (
      <Form {...this.props} />
    )
  }
}

export default connect(
  (state, ownProps) => ({
    valid: selectors.form.valid(state, 'project'),
    loading: selectors.api.loading(state, 'projectForm'),
    error: selectors.api.error(state, 'projectForm')
  }),
  (dispatch) => ({
    toolbarClick: (name, props) => {
      if(name == 'cancel') {
        dispatch(actions.router.redirect(redirects.projectFormCancel()))
      }
      else if(name == 'save') {
        dispatch(actions.router.hook('projectSave'))  
      }
    }
  })
)(ProjectFormContainer)