import React, { Component, PropTypes } from 'react'
import { reduxForm } from 'redux-form'

import Layout from './Layout'
import { processSchema, getFields } from './schema'

const FormContainer = (form = {}) => {
  if(!form.name) throw new Error('FormContainer needs a name')
  if(!form.fields) throw new Error('FormContainer needs form.fields')
  if(!form.reduxForm) throw new Error('FormContainer needs reduxForm')

  const UseLayout = form.layout || Layout
  const reduxForm = form.reduxForm
  const schema = processSchema(form.fields)
  const RenderForm = (props) => {
    return (
      <UseLayout fields={ getFields(schema) } {...props} />
    )
  }
  
  return reduxForm(RenderForm)
}

export default FormContainer