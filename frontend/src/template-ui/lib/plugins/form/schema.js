import React, { Component, PropTypes } from 'react'
import { Field } from 'redux-form'
import { input } from './fields'

export const processSchema = (fields = {}) => {
  return Object.keys(fields || {}).reduce((all, fieldname) => {
    const opts = fields[fieldname] || {}
    const name = opts.name || fieldname
    const fieldDesc = Object.assign({}, {
      name,
      component: input,
      label: opts.title || name.replace(/^\w/, (s) => s.toUpperCase()),
    }, opts)
    all[fieldname] = fieldDesc
    return all
  }, {})
}

export const getFields = (schema = {}) => {
  return Object.keys(schema || {}).reduce((all, name, i) => {
    const fieldProps = Object.assign({}, schema[name], {
      key: i
    })
    const field = (
      <Field {...fieldProps} />
    )
    all[name] = field
    return all
  }, {})
}