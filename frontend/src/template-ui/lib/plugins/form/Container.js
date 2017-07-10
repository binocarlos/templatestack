import React, { Component, PropTypes } from 'react'
import { reduxForm } from 'redux-form'

import Layout from './Layout'
import { processSchema, getFields } from './schema'

const FormContainer = (opts = {}) => {
  if(!opts.name) throw new Error('FormContainer needs a name')
  if(!opts.fields) throw new Error('FormContainer needs opts.fields')
  const UseLayout = opts.layout || Layout
  const schema = processSchema(opts.fields)

  const RenderForm = (props) => {
    const fields = getFields(schema)
    return (
      <UseLayout fields={fields} {...props} />
    )
  }
  
  return reduxForm({
    form: opts.name,
    initialValues: opts.initialValues
  })(RenderForm)
}

export default FormContainer