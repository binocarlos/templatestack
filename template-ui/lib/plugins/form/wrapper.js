import React, { Component, PropTypes } from 'react'
import { reduxForm } from 'redux-form'

const FormWrapper = (opts = {}) => {
  if(!opts.name) throw new Error('FormContainer needs a name')
  if(!opts.fields) throw new Error('FormContainer needs opts.fields')

  const reducer = reduxForm({
    form: opts.name,
    initialValues: opts.initialValues,
    destroyOnUnmount: opts.destroyOnUnmount || false
  })

  return Object.assign({}, opts, {
    reduxForm: reducer
  })
}

export default FormWrapper