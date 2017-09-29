import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

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
    
  }),
  (dispatch) => ({
    toolbarClick: (name) => {
      console.log('-------------------------------------------');
      console.log(name)
    }
  })
)(ProjectFormContainer)