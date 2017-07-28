import React, { Component, PropTypes } from 'react'
import { Field } from 'redux-form'

import * as fields from './fields'

export const processSchema = (fields = {}) => {
  return Object.keys(fields || {}).reduce((all, fieldname) => {
    const opts = fields[fieldname] || {}
    const name = opts.name || fieldname
    // these are the properties passed to a redux-form Field component
    // http://redux-form.com/7.0.1/docs/api/Field.md/
    const fieldDesc = Object.assign({}, {
      name,
      component: fields.input,
      label: opts.title || name.replace(/^\w/, (s) => s.toUpperCase()),
    }, opts)
    all[fieldname] = fieldDesc
    return all
  }, {})
}

export const getFields = (processedSchema = {}) => {
  return Object.keys(processedSchema || {}).reduce((all, name, i) => {
    const fieldProps = Object.assign({}, processedSchema[name], {
      key: i
    })
    const field = (
      <Field {...fieldProps} />
    )
    all[name] = field
    return all
  }, {})
}