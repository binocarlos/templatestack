import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import options from 'template-tools/src/utils/options'

import formSelectors from '../../form/selectors'
import apiSelectors from '../../api/selectors'
import routerActions from '../../router/actions'

const REQUIRED = [
  'name',
  'component',
]

const CrudFormFactory = (opts = {}) => {

  opts = options.processor(opts, {
    required: REQUIRED
  })

  const {
    name,
    component,
  } = opts

  const Form = reduxForm({
    form: name
  })(component)

  class FormContainer extends Component {
    render() {
      return (
        <Form {...this.props} />
      )
    }
  }

  return connect(
    (state, ownProps) => ({
      valid: formSelectors.valid(state, name),
      loading: apiSelectors.loading(state, `${name}Form`),
      error: apiSelectors.error(state, `${name}Form`)
    }),
    (dispatch) => ({
      toolbarClick: (name, props) => {
        if(name == 'cancel') {
          dispatch(routerActions.hook(`${name}Cancel`))
        }
        else if(name == 'save') {
          dispatch(routerActions.hook(`${name}Save`))
        }
      }
    })
  )(FormContainer)
}

export default CrudFormFactory