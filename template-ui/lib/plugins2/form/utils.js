import React, { Component, PropTypes } from 'react'
import { Field } from 'redux-form'
import fields from './fields'

const processSchema = (schema = {}) => {
  return Object.keys(schema || {}).reduce((all, fieldname) => {
    const opts = schema[fieldname] || {}
    const name = opts.name || fieldname

    all[fieldname] = Object.assign({}, {
      name,
      component: fields.input,
      label: opts.title || name.replace(/^\w/, (s) => s.toUpperCase()),
    }, opts)

    return all
  }, {})
}

const getFields = (schema = {}, injectProps = {}) => {
  const processedSchema = processSchema(schema)
  return Object.keys(processedSchema || {}).reduce((all, name, i) => {
    const fieldProps = Object.assign({}, processedSchema[name], injectProps, {
      key: i
    })
    all[name] = (
      <Field {...fieldProps} />
    )
    return all
  }, {})
}

const getDefaults = (schema = {}) => {
  return Object.keys(schema || {}).reduce((all, fieldname) => {
    const opts = schema[fieldname] || {}
    if(opts.default) all[fieldname] = opts.default
    return all
  }, {})
}

const utils = {
  processSchema,
  getFields,
  getDefaults
}

export default utils