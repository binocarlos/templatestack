import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import options from 'template-tools/src/utils/options'

import formSelectors from '../../form/selectors'
import apiSelectors from '../../api/selectors'
import routerActions from '../../router/actions'

const REQUIRED = [
  'name',  
]

const CrudFormFactory = (opts = {}) => {

  opts = options.processor(opts, {
    required: REQUIRED
  })

  let {
    name,
  } = opts

  

  const ComponentWrapper = (props) => {
    let UseComponent = opts.component
    if(opts.getComponent) {
      UseComponent = opts.getComponent(props)
    }
    return (
      <UseComponent {...props} />
    )
  }

  const Form = reduxForm({
    form: name
  })(ComponentWrapper)

  class FormContainer extends Component {
    render() {
      return (
        <Form {...this.props} />
      )
    }
  }

  return connect(
    (state, ownProps) => ({
      formvalues: formSelectors.values(state, name),
      valid: formSelectors.valid(state, name),
      loading: apiSelectors.loading(state, `${name}Form`),
      error: apiSelectors.error(state, `${name}Form`)
    }),
    (dispatch) => ({
      toolbarClick: (actionName, props) => {
        if(actionName == 'cancel') {
          dispatch(routerActions.hook(`${name}Cancel`))
        }
        else if(actionName == 'save') {
          dispatch(routerActions.hook(`${name}Save`))
        }
      }
    })
  )(FormContainer)
}

export default CrudFormFactory